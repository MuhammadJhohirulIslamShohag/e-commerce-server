import { Request, Response } from 'express';
import httpStatus from 'http-status';

import catchAsync from '../../shared/catchAsync';
import responseReturn from '../../shared/responseReturn';

import { CategoryService } from './category.service';
import { ImageUploadHelpers } from '../../helpers/image-upload.helper';
import { validateRequireFields } from '../../shared/validateRequireFields';

class CategoryControllerClass {
  #CategoryService: typeof CategoryService;

  constructor(service: typeof CategoryService) {
    this.#CategoryService = service;
  }

  // create category method
  readonly createCategory = catchAsync(async (req: Request, res: Response) => {
    const { name, files } = req.body;


    // validate body data
    await validateRequireFields({ name });

    // category image file
    const categoryImageFile = await ImageUploadHelpers.imageFileValidate(
      files,
      'categoryImage',
      'category'
    );

 
    // category data
    const categoryObjStructure = {
      name,
      imageURL: categoryImageFile,
    };

    const result = await this.#CategoryService.createCategory(
      categoryObjStructure
    );

    responseReturn(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Category Created Successfully!',
      data: result,
    });
  });

  // get all categories method
  readonly allCategories = catchAsync(async (req: Request, res: Response) => {
    const result = await this.#CategoryService.allCategories(req.query);

    responseReturn(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'All Categories Retrieved Successfully!',
      data: result.result,
      meta: result.meta,
    });
  });

  // get single category method
  readonly getSingleCategory = catchAsync(
    async (req: Request, res: Response) => {
      const categoryId = req.params.id;

      const result = await this.#CategoryService.getSingleCategory(categoryId);

      responseReturn(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Single Category Retrieved Successfully!',
        data: result,
      });
    }
  );

  // update category method
  readonly updateCategory = catchAsync(async (req: Request, res: Response) => {
    const categoryId = req.params.id;
    const {files, ...updateCategoryData } = req.body;

    // check validity request payload body
    await validateRequireFields(updateCategoryData);

    // category image file
    const categoryImageFile =
      await ImageUploadHelpers.imageFileValidateForUpdate(
        files,
        'categoryImage',
        'category'
      );

    const result = await this.#CategoryService.updateCategory(
      categoryId,
      updateCategoryData,
      categoryImageFile
    );

    responseReturn(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Category Updated Successfully!',
      data: result,
    });
  });

  // delete category method
  readonly deleteCategory = catchAsync(async (req: Request, res: Response) => {
    const categoryId = req.params.id;

    const result = await this.#CategoryService.deleteCategory(categoryId);

    responseReturn(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Category Removed Successfully!',
      data: result,
    });
  });

  // get subcategories from category method
  readonly allCategoriesUnderSubcategories = catchAsync(
    async (_req: Request, res: Response) => {
      const result =
        await this.#CategoryService.allCategoriesUnderSubcategories();

      responseReturn(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'All Categories Retrieved Successfully!',
        data: result,
      });
    }
  );
}

export const CategoryController = new CategoryControllerClass(CategoryService);
