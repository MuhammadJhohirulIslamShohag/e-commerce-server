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
  readonly register = catchAsync(async (req: Request, res: Response) => {
    const result = await this.#AuthServices.register(req);

    responseReturn(res, result);
  });

  // login user
  readonly login = catchAsync(async (req: Request, res: Response) => {
    const result = await this.#AuthServices.login(req);
    responseReturn(res, result);
  });

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
  readonly changePassword = catchAsync(
    async (req: Request, res: Response) => {
      const result = await this.#AuthServices.changePassword(req);
      responseReturn(res, result);
    }
  );
}

export const AuthController = new AuthControllerClass(AuthServices);
