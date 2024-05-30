import { Router } from 'express';

import validateRequest from '../../middlewares/validateRequest';
import auth from '../../middlewares/auth';

import { AuthController } from './auth.controller';
import { AuthValidation } from './auth.validation';
import { ENUM_USER_ROLE } from '../../enum/user';

class AuthRoutesClass {
  readonly routers: Router;
  constructor() {
    this.routers = Router();
    this.#RouterAction();
  }

  #RouterAction() {
    this.routers.post(
      '/register',
      validateRequest(AuthValidation.createUserZodSchema),
      AuthController.register
    );

    this.routers.post(
      '/login',
      validateRequest(AuthValidation.loginUserZodSchema),
      AuthController.login
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

    this.routers.patch(
      '/forgot-password',
      validateRequest(AuthValidation.forgotPasswordZodSchema),
      AuthController.forgotPassword
    );

    this.routers.patch(
      '/change-password',
      validateRequest(AuthValidation.changePasswordZodSchema),
      auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER),
      AuthController.changePassword
    );
  }
}

const allRoutes = new AuthRoutesClass().routers;

export { allRoutes as AuthRoutes };
