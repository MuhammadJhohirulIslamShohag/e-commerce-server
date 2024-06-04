import { Request, Response } from 'express';
import httpStatus from 'http-status';

import catchAsync from '../../shared/catchAsync';
import responseReturn from '../../shared/responseReturn';

import { CategoryService } from './category.service';
import { ImageUploadHelpers } from '../../helpers/image-upload.helper';
import { validateRequireFields } from '../../shared/validateRequireFields';
import { TFileRequestBody } from '../../interfaces/common';

class CategoryControllerClass {
  #CategoryService: typeof CategoryService;

  constructor(service: typeof CategoryService) {
    this.#CategoryService = service;
  }

  // create category method
  readonly createCategory = catchAsync(async (req: Request, res: Response) => {
    const { name } = req.body;

    // validate body data
    await validateRequireFields({ name });

    // console.log(req.files, "req.files");

    // category image file
    const categoryImageFiles = await ImageUploadHelpers.imageFilesValidate(
      req.files as unknown as TFileRequestBody,
      'categoryImage',
      'category'
    );

    // category data
    const categoryObjStructure = {
      name,
      imageURLs: categoryImageFiles,
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
    const { name, imageURLs } = req.body;

    // check validity request payload body
    await validateRequireFields({ name, imageURLs });

    // category image file
    const categoryImageFile =
      await ImageUploadHelpers.imageFilesValidateForUpdate(
        req.files as unknown as TFileRequestBody,
        'categoryImage',
        'category'
      );

    const result = await this.#CategoryService.updateCategory(
      categoryId,
      { name, imageURLs: JSON.parse(imageURLs) },
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

  // get get categories menu from category method
  readonly getCategoriesMenu = catchAsync(
    async (_req: Request, res: Response) => {
      const result = await this.#CategoryService.getCategoriesMenu();

      responseReturn(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Categories Menu Retrieved Successfully!',
        data: result,
      });
    }
  );
}

export const CategoryController = new CategoryControllerClass(CategoryService);
