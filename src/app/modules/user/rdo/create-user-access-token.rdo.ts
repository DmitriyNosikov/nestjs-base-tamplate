import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class CreateUserAccessTokenRDO {
  @Expose()
  @ApiProperty({
    description: 'Access-доступа',
    type: String,
    example: 'accessToken'
  })
  accessToken: string;

  @Expose()
  @ApiProperty({
    description: 'Refrersh-токен',
    type: String,
    example: 'refreshToken'
  })
  refreshToken: string;
}