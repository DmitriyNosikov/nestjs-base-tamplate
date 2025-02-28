import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { User } from 'src/app/models';

import { CreateUserDTO } from './dto/create-user.dto';

@Injectable()
export class UserRepository {
  constructor(
    @InjectModel(User)
    private readonly userModel: typeof User
  ) {}
  public async index(): Promise<User[] | null> {
    const users = await this.userModel.findAll();

    return users;
  }

  public async findById(userId: number): Promise<User | null> {
    const user = await this.userModel.findOne({
      where: { id: userId },
    });

    return user;
  }

  public async findByLogin(login: string): Promise<User | null> {
    const user = await this.userModel.findOne({
      where: { login }
    });

    return user;
  }

  public async create(userData: CreateUserDTO): Promise<User | null> {
    const user = await this.userModel.create(userData);

    return user
  }

  public async update(userId: number, updateData: Partial<CreateUserDTO>): Promise<User> {
    const [affectedRows, users] = await this.userModel.update(updateData, {
      where: { id: userId },
      returning: true
    });

    if (!affectedRows || affectedRows <= 0) {
      throw new NotFoundException(`Пользователь с id ${userId} не найден`);
    }
    
    return users[0];
  }

  public async delete(userId: number): Promise<void>{
    await this.userModel.destroy({
      where: { id: userId }
    });
  }
}