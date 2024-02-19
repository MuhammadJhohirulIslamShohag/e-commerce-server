import { Router } from 'express';
import multer from 'multer';

import { SubCategoryController } from './subCategory.controller';

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

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
        upload.fields([{ name: 'subCategoryImage', maxCount: 1 }]),
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
        upload.fields([{ name: 'subCategoryImage', maxCount: 1 }]),
        SubCategoryController.updateSubCategory
      )
      .get(SubCategoryController.getSingleSubCategory)
      .delete(SubCategoryController.deleteSubCategory);
  }
}

const allRoutes = new CategoryRoutesClass().routers;

export { allRoutes as SubCategoryRoutes };
