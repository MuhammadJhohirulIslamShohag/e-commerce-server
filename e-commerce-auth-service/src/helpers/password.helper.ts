import bcrypt from 'bcrypt';
import config from '../config';

const hashPassword = async (password: string): Promise<string | null> => {
  let hashedPassword = null;
  if (password) {
    hashedPassword = await bcrypt.hash(
      password,
      Number(config.bcrypt_salt_rounds)
    );
  }

  return hashedPassword;
};

const comparePassword = async (
  givenPassword: string,
  savedPassword: string
): Promise<boolean> => {
  return bcrypt.compare(givenPassword, savedPassword);
};

export const PasswordHelpers = {
  hashPassword,
  comparePassword,
};
