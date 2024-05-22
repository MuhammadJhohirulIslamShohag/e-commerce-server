import { z } from 'zod';
import { userRoles } from '../user/user.constant';

const createUserZodSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: 'Name is required!',
    }),
    email: z
      .string({
        required_error: 'Email is required!',
      })
      .email()
      .optional(),
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
    location: z
      .string({
        required_error: 'Location is required!',
      })
      .optional(),
    role: z
      .enum([...userRoles] as [string, ...string[]], {
        required_error: 'Role is required!',
      })
      .optional(),
  }),
});

const createUserWithVerifiedZodSchema = z.object({
  body: z.object({
    otp: z.string({
      required_error: 'Otp is required!',
    }),
    email: z
      .string({
        required_error: 'Email is required!',
      })
      .email()
      .optional(),
  }),
});

const loginUserZodSchema = z.object({
  body: z.object({
    email: z
      .string({
        required_error: 'Email is required!',
      })
      .email()
      .optional(),
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

const loginUserWithSocialZodSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: 'Name is required!',
    }),
    email: z
      .string({
        required_error: 'Email is required!',
      })
      .email(),
  }),
});

const refreshTokenZodSchema = z.object({
  cookies: z.object({
    refreshToken: z.string({
      required_error: 'Refresh Token is required!',
    }),
  }),
});

const forgotPasswordZodSchema = z.object({
  body: z.object({
    email: z
      .string({
        required_error: 'Email is required!',
      })
      .email()
      .optional(),
  }),
});

const resetPasswordZodSchema = z.object({
  body: z.object({
    otp: z.string({
      required_error: 'OTP is required!',
    }),
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
    email: z
      .string({
        required_error: 'Email is required!',
      })
      .email()
      .optional(),
  }),
});

const userChangePasswordZodSchema = z.object({
  body: z.object({
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
      .refine(password => (password.match(/[^a-zA-Z0-9]/g) || []).length >= 1, {
        message: 'Password should contain at least 1 symbol.',
      }),
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
      .refine(password => (password.match(/[^a-zA-Z0-9]/g) || []).length >= 1, {
        message: 'Password should contain at least 1 symbol.',
      }),
    email: z
      .string({
        required_error: 'Email is required!',
      })
      .email()
      .optional(),
  }),
});

const resendOtpZodSchema = z.object({
  body: z.object({
    email: z
      .string({
        required_error: 'Email is required!',
      })
      .email()
      .optional(),
  }),
});

export const AuthValidation = {
  createUserZodSchema,
  createUserWithVerifiedZodSchema,
  loginUserZodSchema,
  refreshTokenZodSchema,
  loginUserWithSocialZodSchema,
  forgotPasswordZodSchema,
  resetPasswordZodSchema,
  userChangePasswordZodSchema,
  resendOtpZodSchema,
};
