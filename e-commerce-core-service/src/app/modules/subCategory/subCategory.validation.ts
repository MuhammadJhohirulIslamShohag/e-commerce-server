import { z } from 'zod'

const subCategoryCreateZodSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: 'Sub Category Name is Required!',
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
      ),
    categories: z.array(
      z.object({
        categoryId: z.string({
          required_error: 'Category Id is Required!',
        }),
      })
    ),
  }),
})

const subCategoryUpdateZodSchema = z.object({
  body: z.object({
    name: z.string().optional(),
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
    categories: z
      .array(
        z.object({
          categoryId: z.string({
            required_error: 'Category Id is Required!',
          }),
        })
      )
      .optional(),
  }),
})

export const SubCategoryValidation = {
  subCategoryCreateZodSchema,
  subCategoryUpdateZodSchema,
}
