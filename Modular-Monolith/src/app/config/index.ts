import * as dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.join(process.cwd(), '.env') });

export default {
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  mongo_url: process.env.MONGO_URL,
  bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,
  user_url_auth_service_endpoint: process.env.USER_AUTH_SERVICE_ENDPOINT,
  stripe_secret_key: process.env.STRIPE_SECRET_KEY,
  email: process.env.EMAIL,
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
    aws_access_key_id: process.env.AWS_ACCESS_KEY_ID,
    aws_secret_access_key: process.env.AWS_SECRET_ACCESS_KEY,
    aws_bucket_name: process.env.AWS_BUCKET_NAME,
    aws_region: process.env.AWS_REGION,
  },
};
