import { Router } from 'express';

import validateRequest from '../../middlewares/validateRequest';
import auth from '../../middlewares/auth';

import { SizeValidation } from './size.validation';
import { SizeController } from './size.controller';
import { ENUM_USER_ROLE } from '../../enum/user';

class SizeRouterClass {
  readonly routers: Router;
  constructor() {
    this.routers = Router();
    this.#RouterAction();
  }

  #RouterAction() {
    // create and get all sizes routes
    this.routers
      .route('/')
      .post(
        auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SELLER),
        validateRequest(SizeValidation.sizeCreateZodSchema),
        SizeController.createSize
      )
      .get(SizeController.allSizes);

    // update and get single size, delete routes
    this.routers
      .route('/:id')
      .patch(
        auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SELLER),
        validateRequest(SizeValidation.sizeUpdateZodSchema),
        SizeController.updateSize
      )
      .get(SizeController.getSingleSize)
      .delete(
        auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SELLER),
        SizeController.deleteSize
      );
  }
}

const allRoutes = new SizeRouterClass().routers;

export { allRoutes as SizeRoutes };
