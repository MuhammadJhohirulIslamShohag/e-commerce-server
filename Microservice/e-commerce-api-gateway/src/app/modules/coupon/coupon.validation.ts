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
      discountAmount: z.coerce.number().int().min(1),
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
      data =>
        data.discountAmount <= 100 || data.discountType !== discountType[1],
      {
        message: 'Percentage discount must be less than or equal to 100',
        path: ['discountAmount'],
      }
    )
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
