import { UserRolesType } from '../roles.type';

export type UserTokenPayloadType = {
  userId: number;
  role: UserRolesType
}

export type RefreshTokenPayloadType = {
  userId: number;
  tokenId: string;
  expiresIn: Date;
}