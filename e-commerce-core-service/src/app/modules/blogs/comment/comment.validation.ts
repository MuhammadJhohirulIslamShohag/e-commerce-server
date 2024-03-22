import { z } from 'zod';

const commentCreateZodSchema = z.object({
  body: z.object({
    name: z
      .string({
        required_error: 'Name is Required!',
      })
      .optional(),
    email: z
      .string({
        required_error: 'Email is Required!',
      })
      .email()
      .optional(),
    message: z.string({
      required_error: 'Message is Required!',
    }),
    blogId: z.string({
      required_error: 'Blog Id is Required!',
    }),
  }),
});

const commentUpdateZodSchema = z.object({
  body: z.object({
    status: z.boolean().optional(),
    name: z.string().optional(),
    email: z.string().email().optional(),
    message: z.string().optional(),
    blogId: z.string().optional(),
  }),
});

export const CommentValidation = {
  commentCreateZodSchema,
  commentUpdateZodSchema,
};
