import { z } from 'zod';

const sizeCreateZodSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: 'Size Name is Required!',
    }),
  }),
});

const sizeUpdateZodSchema = z.object({
  body: z.object({
    name: z.string().optional(),
  }),
});

export const SizeValidation = {
  sizeCreateZodSchema,
  sizeUpdateZodSchema,
};
