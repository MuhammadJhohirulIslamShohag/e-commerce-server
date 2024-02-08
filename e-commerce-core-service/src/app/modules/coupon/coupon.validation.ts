import { z } from 'zod'
import { couponStatus } from './coupon.constant'

const couponCreateZodSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: 'Name is Required!',
    }),
    code: z.string({
      required_error: 'Code is Required!',
    }),
    discount: z
      .number({
        required_error: 'Discount is Required!',
      })
      .optional(),
    status: z
      .enum([...couponStatus] as [string, ...string[]], {
        required_error: 'Coupon Status is Required!',
      })
      .optional(),
  }),
})

const couponUpdateZodSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    code: z.string().optional(),
    discount: z.number().optional(),
    status: z.enum([...couponStatus] as [string, ...string[]]).optional(),
  }),
})

export const CouponValidation = {
  couponCreateZodSchema,
  couponUpdateZodSchema,
}
