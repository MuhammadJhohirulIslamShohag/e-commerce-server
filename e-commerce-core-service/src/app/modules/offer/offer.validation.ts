import { z } from 'zod'

const offerCreateZodSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: 'Name is Required!',
    }),
    startDate: z.string({
      required_error: 'Start date is Required!',
    }),
    endDate: z.string({
      required_error: 'End date is Required!',
    }),
    details: z
      .string({
        required_error: 'Details is Required!',
      })
      .optional(),
    imageURL: z
      .string()
      .url()
      .refine(
        value => {
          const extension = value.split('.').pop()
          return ['jpeg', 'jpg', 'gif', 'png', 'webp'].includes(
            extension as string
          )
        },
        {
          message: 'Invalid image url',
        }
      )
      .optional(),
  }),
})

const offerUpdateZodSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    details: z.string().optional(),
    imageURL: z
      .string()
      .url()
      .refine(
        value => {
          const extension = value.split('.').pop()
          return ['jpeg', 'jpg', 'gif', 'png', 'webp'].includes(
            extension as string
          )
        },
        {
          message: 'Invalid image url',
        }
      )
      .optional(),
  }),
})

export const OfferValidation = {
  offerCreateZodSchema,
  offerUpdateZodSchema,
}
