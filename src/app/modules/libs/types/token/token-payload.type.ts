import { UserRolesType } from '../roles.type';

export type UserTokenPayloadType = {
  userId: number;
  role: UserRolesType
}

export type RefreshTokenPayloadType = {
  tokenId: string;
  expiresIn: Date;
  companyId: number;
}