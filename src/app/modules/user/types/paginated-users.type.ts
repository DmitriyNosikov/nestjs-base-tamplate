import { PaginatedResponseType } from '@common/types';
import { CreateUserRDO } from '../rdo/create-user.rdo';

export type PaginatedUsersType = PaginatedResponseType<CreateUserRDO>;