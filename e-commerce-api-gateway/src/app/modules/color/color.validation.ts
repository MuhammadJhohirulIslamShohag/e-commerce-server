import { z } from 'zod'

const colorCreateZodSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: 'Color Name is Required!',
    }),
  }),
})

const colorUpdateZodSchema = z.object({
  body: z.object({
    name: z.string().optional(),
  }),
})

export const ColorValidation = {
  colorCreateZodSchema,
  colorUpdateZodSchema,
}
