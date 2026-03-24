
import { genSalt, hash, compare } from 'bcrypt';

import { IHasher } from '@common/interfaces';

const SALT_ROUNDS = 10;

export class BCryptHasher implements IHasher {
  async getHash(value: string): Promise<string> {
    const salt = await genSalt(SALT_ROUNDS);

    return hash(value, salt);
  }

  async checkHash(value: string, hashedValue: string): Promise<boolean> {
    return compare(value, hashedValue);
  }
}
