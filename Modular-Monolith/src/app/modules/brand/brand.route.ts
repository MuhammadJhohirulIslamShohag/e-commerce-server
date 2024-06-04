import { Router } from 'express';
import multer from 'multer';
import auth from '../../middlewares/auth';

import { BrandController } from './brand.controller';
import { ENUM_USER_ROLE } from '../../enum/user';

const storage = multer.memoryStorage();
const upload = multer({ storage: storage, limits: { fileSize: 1073741824 } });

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
        auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SELLER),
        upload.fields([{ name: 'brandImage', maxCount: 1 }]),
        BrandController.createBrand
      )
      .get(BrandController.allBrands);

    // update and get single brand, delete routes
    this.routers
      .route('/:id')
      .patch(
        auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SELLER),
        upload.fields([{ name: 'brandImage', maxCount: 1 }]),
        BrandController.updateBrand
      )
      .get(BrandController.getSingleBrand)
      .delete(
        auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SELLER),
        BrandController.deleteBrand
      );
  }
}

const allRoutes = new BrandRouterClass().routers;

export { allRoutes as BrandRoutes };
