import { z } from 'zod';
import { userRoles } from './user.constant';

const updateUserZodSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    email: z.string().email().optional(),
    about: z.string().optional(),
    password: z
      .string({
        required_error: 'Password is required!',
      })
      .refine(password => password.length >= 6, {
        message: 'Password should be at least 6 characters long.',
      })
      .refine(password => (password.match(/[a-z]/g) || []).length >= 3, {
        message: 'Password should contain at least 3 lowercase letters.',
      })
      .refine(password => (password.match(/[A-Z]/g) || []).length >= 1, {
        message: 'Password should contain at least 1 uppercase letter.',
      })
      .refine(password => (password.match(/[0-9]/g) || []).length >= 1, {
        message: 'Password should contain at least 1 numeric digit.',
      })
      .refine(password => (password.match(/[^a-zA-Z0-9]/g) || []).length >= 1, {
        message: 'Password should contain at least 1 symbol.',
      })
      .optional(),
    profileImage: z
      .string()
      .url()
      .refine(
        value => {
          const extension = value.split('.').pop();
          return ['jpeg', 'jpg', 'gif', 'png', 'webp'].includes(
            extension as string
          );
        },
        {
          message: 'Invalid profile image url',
        }
      )
      .optional(),
    location: z.string().optional(),
    role: z.enum([...userRoles] as [string, ...string[]]).optional(),
    shippingAddress: z
      .object({
        firstName: z.string().optional(),
        lastName: z.string().optional(),
        company: z.string().optional(),
        address1: z.string().optional(),
        address2: z.string().optional(),
        postCode: z.string().optional(),
        country: z.string().optional(),
        state: z.string().optional(),
        phoneNumber: z.string().optional(),
        city: z.string().optional(),
      })
      .optional(),
  }),
});

const updateShippingAddressZodSchema = z.object({
  body: z.object({
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    company: z.string().optional(),
    address1: z.string().optional(),
    address2: z.string().optional(),
    postCode: z.string().optional(),
    country: z.string().optional(),
    state: z.string().optional(),
    defaultAddress: z.boolean().optional(),
    shippingAddressId: z.string({
      required_error: 'Shipping Address Id is Required!',
    }),
  }),
});

const addWishListProductZodSchema = z.object({
  body: z.object({
    productId: z.string({
      required_error: 'Product Id is Required!',
    }),
  }),
});

export const UserValidation = {
  updateUserZodSchema,
  updateShippingAddressZodSchema,
  addWishListProductZodSchema,
};
