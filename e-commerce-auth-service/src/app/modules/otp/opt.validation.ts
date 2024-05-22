import { z } from 'zod';

const createOtpZodSchema = z.object({
  body: z.object({
    email: z.string().email(),
  }),
});

export const OtpValidation = {
  createOtpZodSchema,
};
