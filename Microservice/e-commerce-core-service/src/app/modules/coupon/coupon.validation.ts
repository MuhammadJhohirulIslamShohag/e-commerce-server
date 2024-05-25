import { z } from 'zod';
import { discountType } from './coupon.constant';

const couponCreateZodSchema = z.object({
  body: z
    .object({
      code: z
        .string({
          required_error: 'Code is Required!',
        })
        .min(1),
      discountAmount: z.string({
        required_error: 'Discount Amount is Required!',
      }),
      discountType: z
        .enum([...discountType] as [string, ...string[]], {
          required_error: 'Discount Type is Required!',
        })
        .optional(),
      expiresAt: z.preprocess(
        value => (value === '' ? undefined : value),
        z.coerce.date().min(new Date()).optional()
      ),
    })
    .refine(
      data => {
        if (data.discountType === discountType[1]) {
          // convert discount amount to a number
          const discountAmountNumber = parseInt(data.discountAmount, 10);
          // check if discountType is percentage and discount amount is less than or equal to 100
          return (
            discountAmountNumber <= 100 || data.discountType !== discountType[1]
          );
        }
      },
      {
        message: 'Percentage discount must be less than or equal to 100',
        path: ['discountAmount'],
      }
    ),
});

const couponUpdateZodSchema = z.object({
  body: z.object({
    isActive: z.boolean().optional(),
    discountAmount: z.coerce.number().int().min(1).optional(),
    discountType: z
      .enum([...discountType] as [string, ...string[]], {
        required_error: 'Discount Type is Required!',
      })
      .optional(),
    expiresAt: z
      .preprocess(
        value => (value === '' ? undefined : value),
        z.coerce.date().min(new Date()).optional()
      )
      .optional(),
  }),
});

export const CouponValidation = {
  couponCreateZodSchema,
  couponUpdateZodSchema,
};
