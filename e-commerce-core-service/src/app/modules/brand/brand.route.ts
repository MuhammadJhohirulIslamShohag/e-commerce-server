import { Router } from 'express';
import multer from 'multer';

import { BrandController } from './brand.controller';

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

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
        upload.fields([{ name: 'brandImage', maxCount: 1 }]),
        BrandController.createBrand
      )
      .get(BrandController.allBrands);

    // update and get single brand, delete routes
    this.routers
      .route('/:id')
      .patch(
        upload.fields([{ name: 'brandImage', maxCount: 1 }]),
        BrandController.updateBrand
      )
      .get(BrandController.getSingleBrand)
      .delete(BrandController.deleteBrand);
  }
}

const allRoutes = new BrandRouterClass().routers;

export { allRoutes as BrandRoutes };
