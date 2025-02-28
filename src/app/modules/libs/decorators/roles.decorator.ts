import { Reflector } from '@nestjs/core';
/*
  Декоратор используется для установки ролей на
  роуты контроллера (в совокупности с role.guard.ts)
*/
export const Roles = Reflector.createDecorator<string[] | string>();