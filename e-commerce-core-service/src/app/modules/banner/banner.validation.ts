import { z } from 'zod'

const bannerCreateZodSchema = z.object({
  body: z.object({
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
      ),
    offer: z.string({ required_error: 'Offer is Required!' }),
  }),
})

const bannerUpdateZodSchema = z.object({
  body: z.object({
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
    offer: z.string().optional(),
  }),
})

export const BannerValidation = {
  bannerCreateZodSchema,
  bannerUpdateZodSchema,
}
