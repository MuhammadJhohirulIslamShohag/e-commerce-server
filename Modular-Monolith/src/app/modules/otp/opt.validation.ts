import { z } from 'zod';

const createOtpZodSchema = z.object({
  body: z.object({
    email: z.string(),
  }),
});

const sendOtpVerifyUserZodSchema = z.object({
  body: z.object({
    email: z.string(),
    role: z.string(),
  }),
});

export const OtpValidation = {
  createOtpZodSchema,
  sendOtpVerifyUserZodSchema
};
