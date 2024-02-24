import multer from 'multer';
import { Router } from 'express';

import auth from '../../middlewares/auth';

import { CategoryController } from './category.controller';
import { ENUM_USER_ROLE } from '../../../enum/user';

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

class CategoryRouterClass {
  readonly routers: Router;
  constructor() {
    this.routers = Router();
    this.#RouterAction();
  }

  #RouterAction() {
    // create and get all categories routes
    this.routers
      .route('/')
      .post(
        auth(ENUM_USER_ROLE.ADMIN),
        upload.fields([{ name: 'CategoryImage', maxCount: 1 }]),
        CategoryController.createCategory
      )
      .get(CategoryController.allCategories);

    // update and get single category, delete routes
    this.routers
      .route('/:id')
      .patch(
        auth(ENUM_USER_ROLE.ADMIN),
        upload.fields([{ name: 'CategoryImage', maxCount: 1 }]),
        CategoryController.updateCategory
      )
      .get(CategoryController.getSingleCategory)
      .delete(auth(ENUM_USER_ROLE.ADMIN), CategoryController.deleteCategory);
  }
}

const allRoutes = new CategoryRouterClass().routers;

export { allRoutes as CategoryRoutes };
