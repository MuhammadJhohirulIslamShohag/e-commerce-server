import { z } from 'zod';

const intentsCreateStripeZodSchema = z.object({
  body: z.object({
    isCouped: z.boolean({
      required_error: 'Is Couped is Required!',
    }),
  }),
});

export const StripeValidation = {
  intentsCreateStripeZodSchema,
};
