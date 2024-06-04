import { Router } from 'express';
import multer from 'multer';
import auth from '../../middlewares/auth';

import { SubCategoryController } from './subCategory.controller';
import { ENUM_USER_ROLE } from '../../enum/user';

const storage = multer.memoryStorage();
const upload = multer({ storage: storage, limits: { fileSize: 1073741824 } });

class CategoryRoutesClass {
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
        auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SELLER),
        upload.single('subCategoryImage'),
        SubCategoryController.createSubCategory
      )
      .get(SubCategoryController.allSubCategories);

    // update and get single Sub Category, delete routes
    this.routers
      .route('/:id')
      .patch(
        auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SELLER),
        upload.single('subCategoryImage'),
        SubCategoryController.updateSubCategory
      )
      .get(SubCategoryController.getSingleSubCategory)
      .delete(
        auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SELLER),
        SubCategoryController.deleteSubCategory
      );
  }
}

const allRoutes = new CategoryRoutesClass().routers;

export { allRoutes as SubCategoryRoutes };
