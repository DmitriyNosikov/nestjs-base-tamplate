
import * as dayjs from 'dayjs';

export type DateTimeUnit = 's' | 'h' | 'd' | 'm' | 'y';
export type TimeAndUnit = { value: number; unit: DateTimeUnit };

export function parseTime(time: string): TimeAndUnit {
  const regex = /^(\d+)([shdmy])/;
  const match = regex.exec(time);

  if (!match) {
    throw new Error(`[parseTime] Не удалось получить время из строки: ${time}`);
  }

  const [, valueRaw, unitRaw] = match;
  const value = parseInt(valueRaw, 10);
  const unit = unitRaw as DateTimeUnit;

  if (isNaN(value)) {
    throw new Error(`[parseTime] Не удалось разобрать строку со временем. Результат: ${value} -> NaN`);
  }

  return { value, unit }
}

export function getJWTExpirationDate(time: string): Date {
  const expiresInTime = parseTime(time);
  const expiresIn = dayjs()
  .add(expiresInTime.value, expiresInTime.unit).toDate()

  return expiresIn;
}