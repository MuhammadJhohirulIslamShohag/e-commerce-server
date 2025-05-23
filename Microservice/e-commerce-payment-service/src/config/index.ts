import * as dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.join(process.cwd(), '.env') });

export default {
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  default_student_pass: process.env.DEFAULT_STUDENT_PASS,
  default_faculty_pass: process.env.DEFAULT_FACULTY_PASS,
  default_admin_pass: process.env.DEFAULT_ADMIN_PASS,
  user_url_auth_service_endpoint: process.env.USER_AUTH_SERVICE_ENDPOINT,
  core_service_endpoint: process.env.CORE_SERVICE_ENDPOINT,
  stripe_secret_key: process.env.STRIPE_SECRET_KEY,
  bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,
  jwt_secret: process.env.JWT_SECRET,
  jwt_expire_in: process.env.JWT_EXPIRE_IN,
  jwt_refresh_secret: process.env.JWT_REFRESH_SECRET,
  jwt_refresh_expire_in: process.env.JWT_REFRESH_EXPIRE_IN,
};
