import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class CreateUserAccessTokenRDO {
  @Expose()
  @ApiProperty({
    description: 'JWT-ACCESS токен доступа',
    type: String,
    example: 'accessToken'
  })
  accessToken: string;

  @Expose()
  @ApiProperty({
    description: 'JWT-REFRESH токен обновления',
    type: String,
    example: 'refreshToken'
  })
  refreshToken: string;
}