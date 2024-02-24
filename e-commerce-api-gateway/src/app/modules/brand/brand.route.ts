import multer from 'multer';
import { Router } from 'express';

import auth from '../../middlewares/auth';

import { BrandController } from './brand.controller';
import { ENUM_USER_ROLE } from '../../../enum/user';

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
        auth(ENUM_USER_ROLE.ADMIN),
        upload.fields([{ name: 'BrandImage', maxCount: 1 }]),
        BrandController.createBrand
      )
      .get(BrandController.allBrands);

    // update and get single brand, delete routes
    this.routers
      .route('/:id')
      .patch(
        auth(ENUM_USER_ROLE.ADMIN),
        upload.fields([{ name: 'BrandImage', maxCount: 1 }]),
        BrandController.updateBrand
      )
      .get(BrandController.getSingleBrand)
      .delete(
        auth(ENUM_USER_ROLE.ADMIN),
        BrandController.deleteBrand
      );
  }
}

const allRoutes = new BrandRouterClass().routers;

export { allRoutes as BrandRoutes };
