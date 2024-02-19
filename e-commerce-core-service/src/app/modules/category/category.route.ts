import { Router } from 'express';
import multer from 'multer';

import { CategoryController } from './category.controller';

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

class CategoryRoutesClass {
  readonly routers: Router;
  constructor() {
    this.routers = Router();
    this.#RouterAction();
  }

  #RouterAction() {
    // get subcategories from category routes
    this.routers
      .route('/allCategoriesUnderSubcategories')
      .get(CategoryController.allCategoriesUnderSubcategories);

    // create and get all categories routes
    this.routers
      .route('/')
      .post(
        upload.fields([{ name: 'categoryImage', maxCount: 1 }]),
        CategoryController.createCategory
      )
      .get(CategoryController.allCategories);

    // update and get single category, delete routes
    this.routers
      .route('/:id')
      .patch(
        upload.fields([{ name: 'categoryImage', maxCount: 1 }]),
        CategoryController.updateCategory
      )
      .get(CategoryController.getSingleCategory)
      .delete(CategoryController.deleteCategory);
  }
}

const allRoutes = new CategoryRoutesClass().routers;

export { allRoutes as CategoryRoutes };
