import { Router } from 'express';

import validateRequest from '../../middlewares/validateRequest';

import { SubCategoryValidation } from './subCategory.validation';
import { SubCategoryController } from './subCategory.controller';


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
        validateRequest(SubCategoryValidation.subCategoryCreateZodSchema),
        SubCategoryController.createSubCategory
      )
      .get(SubCategoryController.allSubCategories);

    // get categories from subcategory routes
    this.routers
      .route('/all-sub-categories-under-category')
      .get(SubCategoryController.allSubCategoriesUnderCategories);

    // update and get single Sub Category, delete routes
    this.routers
      .route('/:id')
      .patch(
        validateRequest(SubCategoryValidation.subCategoryUpdateZodSchema),
        SubCategoryController.updateSubCategory
      )
      .get(SubCategoryController.getSingleSubCategory)
      .delete(SubCategoryController.deleteSubCategory);
  }
}

const allRoutes = new CategoryRoutesClass().routers;

export { allRoutes as SubCategoryRoutes };
