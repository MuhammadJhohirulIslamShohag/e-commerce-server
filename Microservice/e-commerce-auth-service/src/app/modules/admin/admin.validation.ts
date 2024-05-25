import { z } from 'zod';
import { adminRoles, adminStatus } from './admin.constant';

const AdminCreateZodSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: 'Name is Required!',
    }),
    email: z.string().email({ message: 'Invalid email address!' }),
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
      }),
    phone: z
      .string({
        required_error: 'Phone is required!',
      })
      .refine(value => /^\+(?:\d{1,3}-)?\d{1,14}$/.test(value), {
        message: 'Invalid phone number format',
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
    address: z
      .object({
        country: z.string().optional(),
        town: z.string().optional(),
        city: z.string().optional(),
        hometown: z.string().optional(),
      })
      .optional(),
    about: z.string().optional(),
    designation: z.string().optional(),
    workAs: z.string().optional(),
    education: z.string().optional(),
    language: z.string().optional(),
    role: z.enum([...adminRoles] as [string, ...string[]], {
      required_error: 'Admin Role is Required!',
    }),
    status: z
      .enum([...adminStatus] as [string, ...string[]], {
        required_error: 'Admin Status is Required!',
      })
      .optional(),
  }),
});

const AdminLoginZodSchema = z.object({
  body: z.object({
    email: z.string().email({ message: 'Invalid email address!' }),
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
      }),
  }),
});

const AdminUpdateZodSchema = z.object({
  body: z.object({
    name: z.string().optional(),
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
    address: z
      .object({
        country: z.string().optional(),
        town: z.string().optional(),
        city: z.string().optional(),
        hometown: z.string().optional(),
      })
      .optional(),
    about: z.string().optional(),
    designation: z.string().optional(),
    workAs: z.string().optional(),
    education: z.string().optional(),
    language: z.string().optional(),
    role: z.enum([...adminRoles] as [string, ...string[]]).optional(),
    status: z.enum([...adminStatus] as [string, ...string[]]).optional(),
  }),
});

const RefreshTokenAdminZodSchema = z.object({
  cookies: z.object({
    refreshToken: z.string({
      required_error: 'Refresh Token is required!',
    }),
  }),
});

const ResetAdminPasswordZodSchema = z.object({
  body: z
    .object({
      newPassword: z
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
        .refine(
          password => (password.match(/[^a-zA-Z0-9]/g) || []).length >= 1,
          {
            message: 'Password should contain at least 1 symbol.',
          }
        ),
      oldPassword: z
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
        .refine(
          password => (password.match(/[^a-zA-Z0-9]/g) || []).length >= 1,
          {
            message: 'Password should contain at least 1 symbol.',
          }
        ),
      email: z
        .string({
          required_error: 'Email is required!',
        })
        .email()
        .optional(),
      phone: z
        .string({
          required_error: 'Phone is required!',
        })
        .refine(value => /^\+(?:\d{1,3}-)?\d{1,14}$/.test(value), {
          message: 'Invalid phone number format',
        })
        .optional(),
    })
    .refine(
      data => {
        const { email, phone } = data;
        return (email && !phone) || (!email && phone);
      },
      {
        message: 'Either email or phone is required, but not both.',
      }
    ),
});

export const AdminValidation = {
  AdminCreateZodSchema,
  AdminUpdateZodSchema,
  AdminLoginZodSchema,
  RefreshTokenAdminZodSchema,
  ResetAdminPasswordZodSchema,
};
