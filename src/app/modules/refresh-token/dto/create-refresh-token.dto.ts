import { IsDate, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateRefreshTokenDTO {
  @IsNumber()
  userId: number;

  @IsString()
  tokenId: string;

  @IsDate()
  @IsOptional()
  expiresIn?: Date;
}