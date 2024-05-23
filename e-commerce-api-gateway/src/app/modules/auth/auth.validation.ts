import { z } from 'zod';

const createUserZodSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: 'Name is required!',
    }),
    email: z
      .string({
        required_error: 'Email is required!',
      })
      .email(),
    otp: z.number({
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

const refreshTokenZodSchema = z.object({
  cookies: z.object({
    refreshToken: z.string({
      required_error: 'Refresh Token is required!',
    }),
  }),
});


const forgotPasswordZodSchema = z.object({
  body: z.object({
    otp: z.number({
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
  }),
});

const changePasswordZodSchema = z.object({
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
      .email(),
  }),
});

export const AuthValidation = {
  createUserZodSchema,
  loginUserZodSchema,
  refreshTokenZodSchema,
  forgotPasswordZodSchema,
  changePasswordZodSchema,
};
