import { UserRolesType } from '../../types/roles.type';

export interface UserTokenPayloadI {
  userId: number;
  cabinetId: number;
}

export interface UserAdminTokenPayloadI {
  userId: number;
  role: UserRolesType
}

export interface CompanyTokenPayloadI {
  companyId: number;
}

export interface RefreshTokenPayloadI {
  tokenId: string;
  expiresIn: Date;
  companyId: number;
}