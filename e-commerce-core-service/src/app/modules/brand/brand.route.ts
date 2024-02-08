import { Router } from 'express';

import validateRequest from '../../middlewares/validateRequest';

import { BrandValidation } from './brand.validation';
import { BrandController } from './brand.controller';

class BrandRouterClass {
  readonly routers: Router;
  constructor() {
    this.routers = Router();
    this.#RouterAction();
  }

  #RouterAction() {
    // create and get all brands routes
    this.routers
      .route('/')
      .post(
        validateRequest(BrandValidation.brandCreateZodSchema),
        BrandController.createBrand
      )
      .get(BrandController.allBrands);

    // update and get single brand, delete routes
    this.routers
      .route('/:id')
      .patch(
        validateRequest(BrandValidation.brandUpdateZodSchema),
        BrandController.updateBrand
      )
      .get(BrandController.getSingleBrand)
      .delete(BrandController.deleteBrand);
  }
}

const allRoutes = new BrandRouterClass().routers;

export { allRoutes as BrandRoutes };
