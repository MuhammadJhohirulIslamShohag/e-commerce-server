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
      AdminController.createAdmin
    );

    this.routers.post(
      '/login',
      validateRequest(AdminValidation.AdminLoginZodSchema),
      AdminController.loginAdmin
    );

    // get all admin
    this.routers.route('/').get(AdminController.allAdmins);

    // refresh token
    this.routers.post(
      '/admin-refresh-token',
      validateRequest(AdminValidation.RefreshTokenAdminZodSchema),
      AdminController.refreshTokenForAdmin
    );
    // refresh token
    this.routers.get(
      '/admin-refresh-token',
      validateRequest(AdminValidation.RefreshTokenAdminZodSchema),
      AdminController.refreshTokenForAdmin
    );

    // password reset
    this.routers.post(
      '/reset-password',
      validateRequest(AdminValidation.ResetAdminPasswordZodSchema),
      auth(ENUM_USER_ROLE.ADMIN),
      AdminController.adminPasswordReset
    );

    // update and get single admin, delete
    this.routers
      .route('/:id')
      .patch(
        auth(ENUM_USER_ROLE.ADMIN),
        validateRequest(AdminValidation.AdminUpdateZodSchema),
        AdminController.updateAdmin
      )
      .get(auth(ENUM_USER_ROLE.ADMIN), AdminController.getSingleAdmin)
      .delete(auth(ENUM_USER_ROLE.ADMIN), AdminController.deleteAdmin);
  }
}

const allRoutes = new AdminRoutesClass().routers;

export { allRoutes as AdminRoutes };
