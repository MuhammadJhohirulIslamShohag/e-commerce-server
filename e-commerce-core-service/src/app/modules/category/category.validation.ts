import { z } from 'zod';

const categoryCreateZodSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: 'Name is Required!',
    }),
    description: z.string({
      required_error: 'Description is Required!',
    }),
    imageURL: z
      .string()
      .url()
      .refine(
        value => {
          const extension = value.split('.').pop();
          return ['jpeg', 'jpg', 'gif', 'png', 'webp'].includes(
            extension as string
          );
        },
        {
          message: 'Invalid image url',
        }
      ),
  }),
});

const categoryUpdateZodSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    description: z.string().optional(),
    imageURL: z
      .string()
      .url()
      .refine(
        value => {
          const extension = value.split('.').pop();
          return ['jpeg', 'jpg', 'gif', 'png', 'webp'].includes(
            extension as string
          );
        },
        {
          message: 'Invalid image url',
        }
      )
      .optional(),
  }),
});

export const CategoryValidation = {
  categoryCreateZodSchema,
  categoryUpdateZodSchema,
};
