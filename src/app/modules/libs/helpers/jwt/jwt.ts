import { JwtModuleAsyncOptions } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config';

import { CompanyTokenPayloadI, UserAdminTokenPayloadI } from '../../interfaces';
import { Company, User } from 'src/app/models';
import { parseTime } from '../date';
import dayjs from 'dayjs';
import { UserRolesType } from '../../types/roles.type';

export function getJWTOptions(optionSpace: string): JwtModuleAsyncOptions {
  return {
    useFactory: async (configService: ConfigService) => {
      return {
        secret: configService.get<string>(`${optionSpace}.accessTokenSecret`),
        signOptions: {
          expiresIn: configService.get<string>(`${optionSpace}.accessTokenExpiresIn`),
          algorithm: 'HS256',
        }
      };
    },
    inject: [ConfigService]
  }
}


export function getCompanyJWTPayload(company: Company): CompanyTokenPayloadI {
  return {
    companyId: company.id
  }
}

export function getUserJWTPayload(user: User): UserAdminTokenPayloadI {
  return {
    userId: user.id,
    role: user.role as UserRolesType
  }
}

export function getJWTExpirationDate(time: string): Date {
  const expiresInTime = parseTime(time);
  const expiresIn = dayjs()
  .add(expiresInTime.value, expiresInTime.unit).toDate()

  return expiresIn;
}