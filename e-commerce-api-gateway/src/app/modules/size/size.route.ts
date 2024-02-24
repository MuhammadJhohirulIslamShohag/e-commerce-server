import { Router } from 'express';

import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';

import { SizeController } from './size.controller';
import { ENUM_USER_ROLE } from '../../../enum/user';
import { SizeValidation } from './size.validation';

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
        auth(ENUM_USER_ROLE.ADMIN),
        validateRequest(SizeValidation.sizeCreateZodSchema),
        SizeController.createSize
      )
      .get(SizeController.allSizes);

    // update and get single size, delete routes
    this.routers
      .route('/:id')
      .patch(
        auth(ENUM_USER_ROLE.ADMIN),
        validateRequest(SizeValidation.sizeUpdateZodSchema),
        SizeController.updateSize
      )
      .get(SizeController.getSingleSize)
      .delete(auth(ENUM_USER_ROLE.ADMIN), SizeController.deleteSize);
  }
}

const allRoutes = new SizeRouterClass().routers;

export { allRoutes as SizeRoutes };
