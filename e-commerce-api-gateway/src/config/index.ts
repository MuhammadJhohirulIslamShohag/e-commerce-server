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
});

const env = environmentVariableZodSchema.parse(process.env);

export default {
  env: env.NODE_ENV,
  port: env.PORT,
  jwt: {
    secret: env.JWT_SECRET,
  },
  redis: {
    url: env.REDIS_URL,
  },
  auth_service_url: env.AUTH_SERVICE,
  core_service_url: env.CORE_SERVICE,
};
