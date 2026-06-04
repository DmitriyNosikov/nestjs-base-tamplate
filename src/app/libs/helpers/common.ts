import { ClassConstructor, ClassTransformOptions, plainToClass } from 'class-transformer';

type PlainObject<T> = Partial<Record<keyof T, unknown>>;

// 1. Сигнатуры перегрузки
export function fillDTO<T, O>(
  DTOClass: ClassConstructor<T>,
  plainObject: O,
  options?: ClassTransformOptions,
): T;

export function fillDTO<T, O extends []>(
  DTOClass: ClassConstructor<T>,
  plainObject: O,
  options?: ClassTransformOptions,
): T[];

// 2. Реализация перегрузки
export function fillDTO<T, O extends PlainObject<T> | PlainObject<T>[]>(
  DTOClass: ClassConstructor<T>,
  plainObject: O,
  options: ClassTransformOptions = { excludeExtraneousValues: true }
): T | T[] {
  return plainToClass(DTOClass, plainObject, options);
}

export function omitUndefined<T>(value: Record<string, unknown>): T {
  const entries = Object.entries(value);
  const filteredEntries = entries.filter(([, value]) => value !== undefined);

  return Object.fromEntries(filteredEntries) as T;
}