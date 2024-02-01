import bcrypt from 'bcrypt'
import config from '../config'

const hashPassword = async (password: string): Promise<string | null> => {
  let hashedPassword = null
  if (password) {
    hashedPassword = await bcrypt.hash(
      password,
      Number(config.bcrypt_salt_rounds)
    )
  }

  return hashedPassword
}

export const PasswordHelpers = {
  hashPassword,
}
