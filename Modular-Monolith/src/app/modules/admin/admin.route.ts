import { Router } from 'express';

import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';

import { AdminValidation } from './admin.validation';
import { AdminController } from './admin.controller';
import { ENUM_USER_ROLE } from '../../enum/user';

class AdminRoutesClass {
  readonly routers: Router;
  constructor() {
    this.routers = Router();
    this.#RouterAction();
  }

  #RouterAction() {
    // create and login admin
    this.routers.post(
      '/register',
      validateRequest(AdminValidation.createAdminZodSchema),
      AdminController.register
    );

    this.routers.post(
      '/login',
      validateRequest(AdminValidation.loginZodSchema),
      AdminController.login
    );

    // get all admin
    this.routers
      .route('/')
      .get(
        auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SELLER),
        AdminController.allAdmins
      );

    // refresh token
    this.routers.post(
      '/admin-refresh-token',
      validateRequest(AdminValidation.refreshTokenZodSchema),
      AdminController.refreshToken
    );
    // refresh token
    this.routers.get(
      '/admin-refresh-token',
      validateRequest(AdminValidation.refreshTokenZodSchema),
      AdminController.refreshToken
    );

    this.routers.patch(
      '/forgot-password',
      validateRequest(AdminValidation.forgotPasswordZodSchema),
      AdminController.forgotPassword
    );

    this.routers.patch(
      '/change-password',
      validateRequest(AdminValidation.changePasswordZodSchema),
      auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SELLER),
      AdminController.changePassword
    );

    // update and get single admin, delete
    this.routers
      .route('/:id')
      .patch(
        auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SELLER),
        validateRequest(AdminValidation.AdminUpdateZodSchema),
        AdminController.updateAdmin
      )
      .get(
        auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SELLER),
        AdminController.getSingleAdmin
      )
      .delete(
        auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SELLER),
        AdminController.deleteAdmin
      );
  }
}

const allRoutes = new AdminRoutesClass().routers;

export { allRoutes as AdminRoutes };
