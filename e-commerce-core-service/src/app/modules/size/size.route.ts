import { Router } from 'express';

import validateRequest from '../../middlewares/validateRequest';

import { SizeValidation } from './size.validation';
import { SizeController } from './size.controller';

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
        validateRequest(SizeValidation.sizeCreateZodSchema),
        SizeController.createSize
      )
      .get(SizeController.allSizes);

    // update and get single size, delete routes
    this.routers
      .route('/:id')
      .patch(
        validateRequest(SizeValidation.sizeUpdateZodSchema),
        SizeController.updateSize
      )
      .get(SizeController.getSingleSize)
      .delete(SizeController.deleteSize);
  }
}

const allRoutes = new SizeRouterClass().routers;

export { allRoutes as SizeRoutes };
