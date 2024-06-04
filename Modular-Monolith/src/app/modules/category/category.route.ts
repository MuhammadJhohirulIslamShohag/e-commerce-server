import { Router } from 'express';
import multer from 'multer';
import auth from '../../middlewares/auth';

import { CategoryController } from './category.controller';
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
    // get categories menu from category routes
    this.routers.get(
      '/get-categories-menu',
      CategoryController.getCategoriesMenu
    );

    // create and get all categories routes
    this.routers
      .route('/')
      .post(
        auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SELLER),
        upload.array("categoryImage"),
        CategoryController.createCategory
      )
      .get(CategoryController.allCategories);

    // update and get single category, delete routes
    this.routers
      .route('/:id')
      .patch(
        auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SELLER),
        upload.fields([{ name: 'categoryImage', maxCount: 1 }]),
        CategoryController.updateCategory
      )
      .get(CategoryController.getSingleCategory)
      .delete(
        auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SELLER),
        CategoryController.deleteCategory
      );
  }
}

const allRoutes = new CategoryRoutesClass().routers;

export { allRoutes as CategoryRoutes };
