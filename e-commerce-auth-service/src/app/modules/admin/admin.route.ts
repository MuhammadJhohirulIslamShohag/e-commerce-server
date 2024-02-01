import { Router } from 'express';

import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';

import { AdminValidation } from './admin.validation';
import { AdminController } from './admin.controller';
import { ENUM_USER_ROLE } from '../../../enum/user';

class AdminRoutesClass {
  readonly routers: Router;
  constructor() {
    this.routers = Router();
    this.#RouterAction();
  }

  #RouterAction() {
    // create and login admin
    this.routers.post(
      '/signup',
      validateRequest(AdminValidation.AdminCreateZodSchema),
      AdminController.CreateAdmin
    );

    this.routers.post(
      '/login',
      validateRequest(AdminValidation.AdminLoginZodSchema),
      AdminController.LoginAdmin
    );

    // get all admin
    this.routers
      .route('/')
      .get( AdminController.AllAdmins);

    // refresh token
    this.routers.post(
      '/admin-refresh-token',
      validateRequest(AdminValidation.RefreshTokenAdminZodSchema),
      AdminController.RefreshTokenForAdmin
    );
    // refresh token
    this.routers.get(
      '/admin-refresh-token',
      validateRequest(AdminValidation.RefreshTokenAdminZodSchema),
      AdminController.RefreshTokenForAdmin
    );

    // password reset
    this.routers.post(
      '/reset-password',
      validateRequest(AdminValidation.ResetAdminPasswordZodSchema),
      auth(ENUM_USER_ROLE.ADMIN),
      AdminController.AdminPasswordReset
    );

    // update and get single admin, delete
    this.routers
      .route('/:id')
      .patch(
        auth(ENUM_USER_ROLE.ADMIN),
        validateRequest(AdminValidation.AdminUpdateZodSchema),
        AdminController.UpdateAdmin
      )
      .get(auth(ENUM_USER_ROLE.ADMIN), AdminController.GetSingleAdmin)
      .delete(auth(ENUM_USER_ROLE.ADMIN), AdminController.DeleteAdmin);
  }
}

const allRoutes = new AdminRoutesClass().routers;

export { allRoutes as AdminRoutes };
