import { IsString } from 'class-validator';

export class LoginUserDTO {
  @IsString()
  login: string;

  @IsString()
  password: string;
}