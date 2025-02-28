import { Expose } from 'class-transformer';

export class CreateUserAccessTokenRDO {
  @Expose()
  accessToken: string;

  @Expose()
  refreshToken: string;
}