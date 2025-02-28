import { IsOptional, IsString } from 'class-validator';
import { UserRolesType } from '@libs/types';

export class CreateUserDTO {
  @IsString()
  fullName: string;

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