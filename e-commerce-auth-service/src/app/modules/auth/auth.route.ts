import { Router } from 'express';

import validateRequest from '../../middlewares/validateRequest';
import auth from '../../middlewares/auth';

import { AuthController } from './auth.controller';
import { AuthValidation } from './auth.validation';
import { ENUM_USER_ROLE } from '../../../enum/user';

class AuthRoutesClass {
  readonly routers: Router;
  constructor() {
    this.routers = Router();
    this.#RouterAction();
  }

  #RouterAction() {
    this.routers.post(
      '/create-user',
      validateRequest(AuthValidation.createUserZodSchema),
      AuthController.createUser
    );

    this.routers.post(
      '/create-user/verified',
      validateRequest(AuthValidation.createUserWithVerifiedZodSchema),
      AuthController.createUserWithVerified
    );

    this.routers.post(
      '/login-user',
      validateRequest(AuthValidation.loginUserZodSchema),
      AuthController.loginUser
    );

    this.routers.post(
      '/login-with-social',
      validateRequest(AuthValidation.loginUserWithSocialZodSchema),
      AuthController.loginUserWithSocial
    );

    this.routers.post(
      '/refresh-token',
      validateRequest(AuthValidation.refreshTokenZodSchema),
      AuthController.refreshToken
    );
    this.routers.get(
      '/refresh-token',
      validateRequest(AuthValidation.refreshTokenZodSchema),
      AuthController.refreshToken
    );

    this.routers.post(
      '/forgot-password',
      validateRequest(AuthValidation.forgotPasswordZodSchema),
      AuthController.forgotPassword
    );

    this.routers.post(
      '/reset-password',
      validateRequest(AuthValidation.resetPasswordZodSchema),
      AuthController.passwordReset
    );

    this.routers.post(
      '/change-password',
      validateRequest(AuthValidation.userChangePasswordZodSchema),
      auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER),
      AuthController.userChangePasswordReset
    );

    this.routers.post(
      '/resend-otp',
      validateRequest(AuthValidation.resendOtpZodSchema),
      AuthController.resendOtp
    );
  }
}

const allRoutes = new AuthRoutesClass().routers;

export { allRoutes as AuthRoutes };
