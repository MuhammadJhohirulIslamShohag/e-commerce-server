import * as dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.join(process.cwd(), '.env') });

export default {
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  mongo_url: process.env.MONGO_URL,

  bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,
  jwt: {
    jwt_secret: process.env.JWT_SECRET,
    jwt_expire_in: process.env.JWT_EXPIRE_IN,
    jwt_refresh_secret: process.env.JWT_REFRESH_SECRET,
    jwt_refresh_expire_in: process.env.JWT_REFRESH_EXPIRE_IN,
  },
  aws: {
    aws_email_pass: process.env.AWS_EMAIL_PASS,
    aws_email_user: process.env.AWS_EMAIL_USER,
    aws_email_host: process.env.AWS_EMAIL_HOST,
  },
};
