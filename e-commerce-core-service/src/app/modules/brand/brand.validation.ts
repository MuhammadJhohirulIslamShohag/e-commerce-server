import { z } from 'zod'
import { brandStatus } from './brand.constant'

const brandCreateZodSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: 'Name is Required!',
    }),
    email: z
      .string({
        required_error: 'Email is Required!',
      })
      .email(),
    location: z.string({
      required_error: 'Location is Required!',
    }),
    website: z.string({
      required_error: 'Website is Required!',
    }),
    description: z.string({
      required_error: 'Description is Required!',
    }),
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
    suppliers: z.array(
      z.object({
        supplierId: z.string({
          required_error: 'Supplier Id is Required!',
        }),
      })
    ),
    status: z
      .enum([...brandStatus] as [string, ...string[]], {
        required_error: 'Brand Status is Required!',
      })
      .optional(),
  }),
})

const brandUpdateZodSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    email: z.string().email().optional(),
    location: z.string().optional(),
    website: z.string().optional(),
    description: z.string().optional(),
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
    suppliers: z
      .array(
        z.object({
          supplierId: z.string().optional(),
        })
      )
      .optional(),
    status: z.enum([...brandStatus] as [string, ...string[]]).optional(),
  }),
})

export const BrandValidation = {
  brandCreateZodSchema,
  brandUpdateZodSchema,
}
