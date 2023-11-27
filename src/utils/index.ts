import * as bcrypt from 'bcrypt';

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}

export async function generateRandom() {
  const num = Math.floor(Math.random() * 90000) + 10000;

  return num;
}