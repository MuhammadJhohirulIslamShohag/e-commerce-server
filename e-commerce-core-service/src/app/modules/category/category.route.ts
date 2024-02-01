import { Router } from 'express';

import validateRequest from '../../middlewares/validateRequest';

import { CategoryController } from './category.controller';
import { CategoryValidation } from './category.validation';

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
        validateRequest(CategoryValidation.categoryCreateZodSchema),
        CategoryController.createCategory
      )
      .get(CategoryController.allCategories);

    // update and get single category, delete routes
    this.routers
      .route('/:id')
      .patch(
        validateRequest(CategoryValidation.categoryUpdateZodSchema),
        CategoryController.updateCategory
      )
      .get(CategoryController.getSingleCategory)
      .delete(CategoryController.deleteCategory);
  }
}

const allRoutes = new CategoryRoutesClass().routers;

export { allRoutes as CategoryRoutes };
