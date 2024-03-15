import multer from 'multer';
import { Router } from 'express';

import auth from '../../middlewares/auth';

import { SubCategoryController } from './subCategory.controller';
import { ENUM_USER_ROLE } from '../../../enum/user';

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

class SubCategoryRouterClass {
  readonly routers: Router;
  constructor() {
    this.routers = Router();
    this.#RouterAction();
  }

  #RouterAction() {
    // create and get all sub categories routes
    this.routers
      .route('/')
      .post(
        auth(ENUM_USER_ROLE.ADMIN),
        upload.fields([{ name: 'subCategoryImage', maxCount: 1 }]),
        SubCategoryController.createSubCategory
      )
      .get(SubCategoryController.allSubCategories);

    // update and get single sub category, delete routes
    this.routers
      .route('/:id')
      .patch(
        auth(ENUM_USER_ROLE.ADMIN),
        upload.fields([{ name: 'subCategoryImage', maxCount: 1 }]),
        SubCategoryController.updateSubCategory
      )
      .get(SubCategoryController.getSingleSubCategory)
      .delete(
        auth(ENUM_USER_ROLE.ADMIN),
        SubCategoryController.deleteSubCategory
      );
  }
}

const allRoutes = new SubCategoryRouterClass().routers;

export { allRoutes as SubCategoryRoutes };
