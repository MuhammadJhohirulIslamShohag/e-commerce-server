import { Request } from 'express';

import { AuthService } from '../../../shared/axios';
import { IGenericResponse } from '../../../interfaces/common';

class AuthServiceClass {
  #AuthService;
  constructor() {
    this.#AuthService = AuthService;
  }

  // create user
  readonly createUser = async (req: Request) => {
    const response: IGenericResponse = await this.#AuthService.post(
      `auth/create-user`,
      req.body
    );
    return response;
  };

  // create user with verified
  readonly createUserWithVerified = async (req: Request) => {
    const response: IGenericResponse = await this.#AuthService.post(
      `auth/create-user/verified`,
      req.body
    );
    return response;
  };

  // login user
  readonly loginUser = async (req: Request) => {
    const response: IGenericResponse = await this.#AuthService.post(
      `auth/login-user`,
      req.body
    );
    return response;
  };

  // login user with social
  readonly loginUserWithSocial = async (req: Request) => {
    const response: IGenericResponse = await this.#AuthService.post(
      `auth/login-with-social`,
      req.body
    );
    return response;
  };

  // refresh token
  readonly refreshToken = async (req: Request) => {
    const response: IGenericResponse = await this.#AuthService.post(
      `auth/refresh-token`,
      req.body
    );
    return response;
  };

  // forgot password
  readonly forgotPassword = async (req: Request) => {
    const response: IGenericResponse = await this.#AuthService.post(
      `auth/forgot-password`,
      req.body
    );
    return response;
  };

  // password reset
  readonly passwordReset = async (req: Request) => {
    const response: IGenericResponse = await this.#AuthService.post(
      `auth/reset-password`,
      req.body
    );
    return response;
  };

  // password reset
  readonly userChangePasswordReset = async (req: Request) => {
    const response: IGenericResponse = await this.#AuthService.post(
      `auth/change-password`,
      req.body
    );
    return response;
  };

  // re-send otp
  readonly resendOtp = async (req: Request) => {
    const response: IGenericResponse = await this.#AuthService.post(
      `auth/resend-otp`,
      req.body
    );
    return response;
  };
}

export const AuthServices = new AuthServiceClass();
