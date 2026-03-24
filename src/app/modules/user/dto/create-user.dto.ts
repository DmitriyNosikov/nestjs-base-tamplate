import { IsOptional, IsString } from 'class-validator';
import { UserRolesType, UserRolesTypeEnum } from '@core/common/types';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDTO {
  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Логин пользователя',
    type: String,
    example: 'admin'
  })
  login?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Пароль пользователя',
    type: String,
    example: 'Password'
  })
  password?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Роль пользователя',
    enum: UserRolesTypeEnum,
    example: 'USER'
  })
  role?: UserRolesType;
}