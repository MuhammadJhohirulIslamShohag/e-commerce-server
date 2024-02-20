import { z } from 'zod'
import { productStatus } from './product.constant'

const productCreateZodSchema = z.object({
  body: z.object({
    name: z
      .string({
        required_error: 'Name is Required!',
      })
      .nonempty({
        message: 'Name can not be empty!',
      }),
    metaTitle: z
      .string({
        required_error: 'Meta Title is Required!',
      })
      .optional(),
    description: z
      .string({
        required_error: 'Description is Required!',
      })
      .nonempty({
        message: 'Description can not be empty!',
      }),
    price: z
      .number({
        required_error: 'Price is Required!',
      })
      .refine(value => value >= 0, {
        message: 'Price must not be negative or zero',
      }),
    isFeatured: z.boolean({
      required_error: 'Is Featured is Required!',
    }),
    discount: z
      .number({
        required_error: 'Discount is Required!',
      })
      .refine(value => value >= 0 && value < 100, {
        message:
          'Discount must be greater than or equal to 0 and less than 100',
      }),
    quantity: z
      .number({
        required_error: 'Quantity is Required!',
      })
      .refine(value => value >= 0, {
        message: 'Quantity must not be negative or zero',
      }),
    imageURLs: z
      .array(
        z
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
      )
      .nonempty({
        message: 'ImageURL can not be empty!',
      }),
    specifications: z.array(
      z.object({
        sectionTitle: z.string(),
        fields: z.array(
          z.object({
            isKeyFeatured: z.boolean().optional(),
            property: z.string(),
            value: z.string(),
          })
        ),
      })
    ),
    status: z.enum([...productStatus] as [string, ...string[]], {
      required_error: 'Product Status is Required!',
    }),
    questions: z
      .object({
        questionId: z
          .string({
            required_error: 'Question Id is Required!',
          })
          .optional(),
      })
      .optional(),
    reviews: z
      .object({
        name: z
          .string({
            required_error: 'Name is Required!',
          })
          .optional(),
        reviewId: z
          .string({
            required_error: 'Review Id is Required!',
          })
          .optional(),
      })
      .optional(),
    category: z.object({
      name: z.string({
        required_error: 'Name is Required!',
      }),
      categoryId: z.string({
        required_error: 'Category Id is Required!',
      }),
    }),
    subCategories: z.array(
      z.object({
        name: z.string({
          required_error: 'Name is Required!',
        }),
        subCategoryId: z.string({
          required_error: 'Sub Category Id is Required!',
        }),
      })
    ),
    brand: z.object({
      name: z.string({
        required_error: 'Name is Required!',
      }),
      brandId: z.string({
        required_error: 'Brand Id is Required!',
      }),
    }),
    color: z
      .object({
        name: z
          .string({
            required_error: 'Name is Required!',
          })
          .optional(),
        colorId: z
          .string({
            required_error: 'Color Id is Required!',
          })
          .optional(),
      })
      .optional(),
    size: z
      .object({
        name: z
          .string({
            required_error: 'Name is Required!',
          })
          .optional(),
        sizeId: z
          .string({
            required_error: 'Size is Required!',
          })
          .optional(),
      })
      .optional(),
  }),
})

const productUpdateZodSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    metaTitle: z.string().optional(),
    description: z.string().optional(),
    price: z.number().optional(),
    quantity: z.number().optional(),
    discount: z.number().optional(),
    isFeatured: z.boolean().optional(),
    stockQuantity: z.number().optional(),
    imageURLs: z
      .array(
        z
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
      )
      .optional(),
    status: z.enum([...productStatus] as [string, ...string[]]).optional(),
    reviews: z
      .object({
        name: z.string({
          required_error: 'Name is Required!',
        }),
        reviewId: z.string({
          required_error: 'Review Id is Required!',
        }),
      })
      .optional(),
    questions: z
      .object({
        questionId: z.string({
          required_error: 'Question is Required!',
        }),
      })
      .optional(),
    category: z
      .object({
        name: z.string({
          required_error: 'Name is Required!',
        }),
        categoryId: z.string({
          required_error: 'Category Id is Required!',
        }),
      })
      .optional(),
    subCategories: z
      .array(
        z.object({
          name: z.string(),
          subCategoryId: z.string(),
        })
      )
      .optional(),
    branch: z
      .object({
        name: z.string({
          required_error: 'Name is Required!',
        }),
        branchId: z.string({
          required_error: 'Branch Id is Required!',
        }),
      })
      .optional(),
    brand: z
      .object({
        name: z.string({
          required_error: 'Name is Required!',
        }),
        brandId: z.string({
          required_error: 'Brand Id is Required!',
        }),
      })
      .optional(),
    color: z
      .object({
        name: z.string({
          required_error: 'Name is Required!',
        }),
        colorId: z.string({
          required_error: 'Color Id is Required!',
        }),
      })
      .optional(),
    size: z
      .object({
        name: z.string({
          required_error: 'Name is Required!',
        }),
        sizeId: z.string({
          required_error: 'Size is Required!',
        }),
      })
      .optional(),
  }),
})

const addReviewToProductZodSchema = z.object({
  body: z.object({
    rating: z.number({
      required_error: 'Rating is Required!',
    }),
    review: z.object({
      email: z
        .string({
          required_error: 'Email is Required!',
        })
        .email(),
      userId: z.string({
        required_error: 'User Id is Required!',
      }),
      comment: z.string({
        required_error: 'Comment is Required!',
      }),
    }),
  }),
})

const addQuestionToProductZodSchema = z.object({
  body: z.object({
    email: z
      .string({
        required_error: 'Email is Required!',
      })
      .email(),
    userId: z.string({
      required_error: 'User Id is Required!',
    }),
    question: z.string({
      required_error: 'Question is Required!',
    }),
    answer: z.string().optional(),
  }),
})

export const ProductValidation = {
  productCreateZodSchema,
  productUpdateZodSchema,
  addReviewToProductZodSchema,
  addQuestionToProductZodSchema,
}
