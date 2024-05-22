import { Request, Response } from 'express';

import catchAsync from '../../../shared/catchAsync';
import responseReturn from '../../../shared/responseReturn';

import { AuthServices } from './auth.service';

class AuthControllerClass {
  #AuthServices: typeof AuthServices;

  constructor(service: typeof AuthServices) {
    this.#AuthServices = service;
  }

  // create user
  readonly createUser = catchAsync(async (req: Request, res: Response) => {
    const result = await this.#AuthServices.createUser(req);

    responseReturn(res, result);
  });

  // create user with verified
  readonly createUserWithVerified = catchAsync(
    async (req: Request, res: Response) => {
      const result = await this.#AuthServices.createUserWithVerified(req);
      responseReturn(res, result);
    }
  );

  // login user
  readonly loginUser = catchAsync(async (req: Request, res: Response) => {
    const result = await this.#AuthServices.loginUser(req);
    responseReturn(res, result);
  });

  // login user with social
  readonly loginUserWithSocial = catchAsync(
    async (req: Request, res: Response) => {
      const result = await this.#AuthServices.loginUserWithSocial(req);
      responseReturn(res, result);
    }
  );

  // refresh token controller
  readonly refreshToken = catchAsync(async (req: Request, res: Response) => {
    const result = await this.#AuthServices.refreshToken(req);
    responseReturn(res, result);
  });

  // forgot password
  readonly forgotPassword = catchAsync(async (req: Request, res: Response) => {
    const result = await this.#AuthServices.forgotPassword(req);
    responseReturn(res, result);
  });

  // password reset
  readonly passwordReset = catchAsync(async (req: Request, res: Response) => {
    const result = await this.#AuthServices.passwordReset(req);
    responseReturn(res, result);
  });

  // password reset
  readonly userChangePasswordReset = catchAsync(
    async (req: Request, res: Response) => {
      const result = await this.#AuthServices.userChangePasswordReset(req);
      responseReturn(res, result);
    }
  );

  // re-send otp
  readonly resendOtp = catchAsync(async (req: Request, res: Response) => {
    const result = await this.#AuthServices.resendOtp(req);
    responseReturn(res, result);
  });
}

export const AuthController = new AuthControllerClass(AuthServices);
