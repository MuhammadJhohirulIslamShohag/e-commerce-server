import * as dotenv from 'dotenv';
import { z } from 'zod';
import path from 'path';
dotenv.config({ path: path.join(process.cwd(), '.env') });

const environmentVariableZodSchema = z.object({
  NODE_ENV: z.string(),
  PORT: z
    .string()
    .default('3010')
    .refine(value => Number(value)),
  JWT_SECRET: z.string(),
  REDIS_URL: z.string(),
  AUTH_SERVICE: z.string(),
  CORE_SERVICE: z.string(),
  AWS_ACCESS_KEY_ID: z.string(),
  AWS_SECRET_ACCESS_KEY: z.string(),
  AWS_BUCKET_NAME: z.string(),
});

const env = environmentVariableZodSchema.parse(process.env);

export default {
  env: env.NODE_ENV,
  port: env.PORT,
  jwt: {
    secret: env.JWT_SECRET,
  },
  aws: {
    aws_email_pass: process.env.AWS_EMAIL_PASS,
    aws_email_user: process.env.AWS_EMAIL_USER,
    aws_email_host: process.env.AWS_EMAIL_HOST,
    aws_access_key_id: process.env.AWS_ACCESS_KEY_ID,
    aws_secret_access_key: process.env.AWS_SECRET_ACCESS_KEY,
    aws_bucket_name: process.env.AWS_BUCKET_NAME,
  },
  redis: {
    url: env.REDIS_URL,
  },
  auth_service_url: env.AUTH_SERVICE,
  core_service_url: env.CORE_SERVICE,
};
