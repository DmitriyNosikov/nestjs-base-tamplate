import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport'
import { Strategy } from 'passport-local';

import { User } from '@models/index';
import { UserService } from '../modules/user/user.service';

const USERNAME_FIELD_NAME = 'login';

@Injectable()
export class UserLocalStrategy extends PassportStrategy(Strategy, 'user-local') {
  constructor(
    private readonly userService: UserService
  ) {
    super({ usernameField: USERNAME_FIELD_NAME });
  }

  public async validate(login: string, password: string): Promise<User> {
    return this.userService.authorize({ login, password });
  }
}
