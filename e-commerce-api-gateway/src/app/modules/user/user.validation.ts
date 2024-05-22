import { z } from 'zod';
import { userRoles, otpMethodEnum } from './user.constant';

const updateUserZodSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    phone: z
      .string()
      .refine(value => /^\+(?:\d{1,3}-)?\d{1,14}$/.test(value), {
        message: 'Invalid phone number format',
      })
      .optional(),
    email: z.string().email().optional(),
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
    provider: z.enum([...otpMethodEnum] as [string, ...string[]]).optional(),
  }),
});

const addShippingAddressZodSchema = z.object({
  body: z.object({
    firstName: z.string({
      required_error: 'First Name is Required!',
    }),
    lastName: z.string({
      required_error: 'Last Name is Required!',
    }),
    company: z.string({
      required_error: 'Company is Required!',
    }),
    address1: z.string({
      required_error: 'Address1 is Required!',
    }),
    address2: z.string({
      required_error: 'Address2 is Required!',
    }),
    postCode: z.string({
      required_error: 'Post Code is Required!',
    }),
    country: z.string({
      required_error: 'Country is Required!',
    }),
    state: z.string({
      required_error: 'State is Required!',
    }),
    defaultAddress: z.boolean({
      required_error: 'Default Address is Required!',
    }),
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

const addShippingAddressesZodSchema = z.object({
  body: z.object({
    recipientName: z.string({
      required_error: 'Recipient Name is Required!',
    }),
    streetAddress: z.string({
      required_error: 'Street Address is Required!',
    }),
    city: z.string({
      required_error: 'City is Required!',
    }),
    stateProvince: z.string({
      required_error: 'State Province is Required!',
    }),
    postalCode: z.string({
      required_error: 'Postal Code is Required!',
    }),
    country: z.string({
      required_error: 'Country is Required!',
    }),
    phoneNumber: z.string({
      required_error: 'Phone Number is Required!',
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
  addShippingAddressZodSchema,
  updateShippingAddressZodSchema,
  addWishListProductZodSchema,
  addShippingAddressesZodSchema,
};
