import { z } from 'zod'
import { otpMethodEnum } from './otp.constant'

const createOtpZodSchema = z.object({
  body: z.object({
    otp: z.string({
      required_error: 'Otp is required!',
    }),
    expireDate: z.date({
      required_error: 'Expire Date is required!',
    }),
    method: z
      .enum([...otpMethodEnum] as [string, ...string[]], {
        required_error: 'Method is required!',
      })
      .optional(),
  }),
})

export const OtpValidation = {
  createOtpZodSchema,
}
