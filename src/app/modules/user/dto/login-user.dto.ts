import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class LoginUserDTO {
  @IsString()
  @ApiProperty({
    description: 'Логин пользователя',
    type: String,
    example: 'admin'
  })
  login: string;

  @IsString()
  @ApiProperty({
    description: 'Пароль пользователя',
    type: String,
    example: 'Password'
  })
  password: string;
}