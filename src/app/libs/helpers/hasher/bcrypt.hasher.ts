
import { genSalt, hash, compare } from 'bcrypt';

import { HasherI } from '../../../interfaces';

const SALT_ROUNDS = 10;

export class BCryptHasher implements HasherI {
  async getHash(value: string): Promise<string> {
    const salt = await genSalt(SALT_ROUNDS);

    return hash(value, salt);
  }

  async checkHash(value: string, hashedValue: string): Promise<boolean> {
    return compare(value, hashedValue);
  }
}
