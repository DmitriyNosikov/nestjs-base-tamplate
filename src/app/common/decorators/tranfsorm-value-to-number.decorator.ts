import { Transform } from 'class-transformer';

export function TransformValueToNumber() {
  return Transform((field) => {
    if (field.value) {
      const value = Number(field.value);

      if (isNaN(value)) {
        return undefined;
      }

      return value;
    }
  })
}