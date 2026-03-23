import { IsOptional, IsString } from 'class-validator';
import { UserRolesType } from '@core/types';

export class CreateUserDTO {
  @IsString()
  @IsOptional()
  login?: string;

  @IsString()
  @IsOptional()
  password?: string;

  @IsString()
  @IsOptional()
  role?: UserRolesType
}