import { Transform } from 'class-transformer';

export function TransformValueToBoolean() {
  return Transform((field) => {
    if (field.value) {
      if (field.value === 'false' || parseInt(field.value) <= 0) {
        return false;
      }

      return !!field.value;
    }
  })
}