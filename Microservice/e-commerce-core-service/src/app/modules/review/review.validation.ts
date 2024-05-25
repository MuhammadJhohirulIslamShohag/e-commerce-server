import { z } from 'zod';

const reviewCreateZodSchema = z.object({
  body: z.object({
    productId: z.string({
      required_error: 'Product Id is Required!',
    }),
    rating: z.number({
      required_error: 'Rating is Required!',
    }),
    userId: z.string({
      required_error: 'User Id is Required!',
    }),
    comment: z.string({
      required_error: 'Comment is Required!',
    }),
  }),
});

const reviewUpdateZodSchema = z.object({
  body: z.object({
    productId: z.string(),
    rating: z.number().optional(),
    userId: z.string(),
    comment: z.string().optional(),
  }),
});

export const ReviewValidation = {
  reviewCreateZodSchema,
  reviewUpdateZodSchema,
};
