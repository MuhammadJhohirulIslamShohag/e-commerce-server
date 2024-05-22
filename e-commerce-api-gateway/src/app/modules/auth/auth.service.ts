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
      `auth/register`,
      req.body
    );
    return response;
  };

  // login user
  readonly loginUser = async (req: Request) => {
    const response: IGenericResponse = await this.#AuthService.post(
      `auth/login`,
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
}

export const AuthServices = new AuthServiceClass();
