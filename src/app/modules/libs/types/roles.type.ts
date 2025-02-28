export const UserRolesTypeEnum = {
  USER: 'USER',
  ADMIN: 'ADMIN'
} as const;

export type UserRolesType = (typeof UserRolesTypeEnum)[keyof typeof UserRolesTypeEnum];