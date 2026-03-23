import { ConflictException, HttpException, HttpStatus, Inject, Injectable, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigType } from '@nestjs/config';

import { jwtConfig } from '@core/config';
import { BCryptHasher, getJWTExpirationDate } from '@core/libs/helpers';
import { RefreshTokenPayloadType, UserRolesType, UserRolesTypeEnum, UserTokenPayloadType } from '@core/types';

import { RefreshTokenService } from '@modules/refresh-token/refresh-token.service';

import { User } from '@models/index';
import { UserRepository } from './user.repository';

import { CreateUserDTO } from './dto/create-user.dto';
import { LoginUserDTO } from './dto/login-user.dto';
import { CreateUserAccessTokenRDO } from './rdo/create-user-access-token.rdo';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    private readonly userRepository: UserRepository,

    private readonly jwtService: JwtService,
    private readonly refreshTokenService: RefreshTokenService,

    @Inject(jwtConfig.KEY)
    private readonly jwtOptions: ConfigType<typeof jwtConfig>,

    @Inject('Hasher')
    private readonly hasher: BCryptHasher,
  ) { }

  public async createUser(userData: CreateUserDTO) {
    const isUserExists = await this.userRepository.findByLogin(userData.login);

    if (isUserExists) {
      throw new ConflictException(`Пользователь с логином ${userData.login} уже зарегистрирован в системе`);
    }

    const hashedUsersPassword = await this.hasher.getHash(userData.password);
    const newUserData: CreateUserDTO = {
      ...userData,
      login: userData.login,
      password: hashedUsersPassword,
      role: userData.role ?? UserRolesTypeEnum.USER
    };

    const newUser = await this.userRepository.create(newUserData);

    return newUser;
  }

  public async index() {
    const users = await this.userRepository.index();

    return users;
  }

  public async updateUser(userId: number, updateData: Partial<CreateUserDTO>) {
    const isUserExists = await this.userRepository.findById(userId);

    if (!isUserExists) {
      throw new Error(`Пользователь с id ${userId} не найден`);
    }

    const updatedUser = await this.userRepository.update(userId, updateData);

    return updatedUser;
  }

  public async deleteUser(userId: number): Promise<void> {
    await this.userRepository.delete(userId);
  }

  public async getUserById(userId: number) {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new Error(`Пользователь с id ${userId} не найден`);
    }

    return user
  }

  public async authorize(dto: LoginUserDTO): Promise<User> {
    const { login, password } = dto;
    const user = await this.userRepository.findByLogin(login);

    if (!user) {
      throw new NotFoundException(`Пользователь ${user} не найден`);
    }

    const verifyUser = await this.hasher.checkHash(password, user.password);

    if (!verifyUser) {
      throw new UnauthorizedException('Некорректный логин/пароль пользователя');
    }

    return user;
  }

  public async createToken(userId: number): Promise<CreateUserAccessTokenRDO> {
    const existsUser = await this.userRepository.findById(userId);

    if (!existsUser) {
      throw new Error(`Пользователь с id ${userId} не найден`);
    }

    const accessTokenPayload = this.getUserJWTPayload(existsUser);
    const refreshTokenPayload: RefreshTokenPayloadType = {
      ...accessTokenPayload,
      tokenId: crypto.randomUUID(),
      expiresIn: getJWTExpirationDate(this.jwtOptions.refreshTokenExpiresIn)
    };

    try {
      const accessToken = await this.jwtService.signAsync(accessTokenPayload);
      const refreshToken = await this.jwtService.signAsync(refreshTokenPayload, {
        secret: this.jwtOptions.refreshTokenSecret,
        expiresIn: this.jwtOptions.refreshTokenExpiresIn
      });

      // Сохраняем рефреш-токен в БД
      await this.refreshTokenService.createRefreshSession(refreshTokenPayload);

      return { accessToken, refreshToken };
    } catch (error) {
      this.logger.error(`Ошибка генерации токена доступа пользователя ${userId}: `, error);

      throw new HttpException(`Не удалось сгенерировать токен доступа для пользователя ${userId}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async refreshToken(
    tokenPayload: RefreshTokenPayloadType
  ): Promise<CreateUserAccessTokenRDO> {
    const [, tokens] = await Promise.all([
      // т.к. рефреш-токен одноразовый - 
      // удаляем его из бд при использованее
      await this.refreshTokenService.deleteRefreshSession(tokenPayload.tokenId),

      // получаем новую пару ключей
      await this.createToken(tokenPayload.userId)
    ]);

    return tokens;
  }

  private getUserJWTPayload(user: User): UserTokenPayloadType {
    return {
      userId: user.id,
      role: user.role as UserRolesType
    }
  }
}