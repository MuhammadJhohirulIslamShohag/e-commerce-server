import { Request, Response } from 'express';
import httpStatus from 'http-status';

import { SubCategoryService } from './subCategory.service';

import catchAsync from '../../shared/catchAsync';
import responseReturn from '../../shared/responseReturn';

class SubCategoryControllerClass {
  #SubCategoryService: typeof SubCategoryService;

  constructor(service: typeof SubCategoryService) {
    this.#SubCategoryService = service;
  }

  // create sub category method
  readonly createSubCategory = catchAsync(
    async (req: Request, res: Response) => {
      const { ...subCategoryData } = req.body;
      
      const result = await this.#SubCategoryService.createSubCategory(
        subCategoryData
      );

      responseReturn(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'SubCategory Created Successfully!',
        data: result,
      });
    }
  );

  // get all sub categories method
  readonly allSubCategories = catchAsync(
    async (req: Request, res: Response) => {
      const result = await this.#SubCategoryService.allSubCategories(req.query);

      responseReturn(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'All Sub Categories Retrieved Successfully!',
        data: result,
      });
    }
  );

  // get single sub category user method
  readonly getSingleSubCategory = catchAsync(
    async (req: Request, res: Response) => {
      const subCategoryId = req.params.id;

      const result = await this.#SubCategoryService.getSingleSubCategory(
        subCategoryId
      );

      responseReturn(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Single Sub Category Retrieved Successfully!',
        data: result,
      });
    }
  );

  // update sub category method
  readonly updateSubCategory = catchAsync(
    async (req: Request, res: Response) => {
      const subCategoryId = req.params.id;
      const { ...updateSubCategoryData } = req.body;

      const result = await this.#SubCategoryService.updateSubCategory(
        subCategoryId,
        updateSubCategoryData
      );

      responseReturn(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Sub Category Updated Successfully!',
        data: result,
      });
    }
  );

  // delete sub category method
  readonly deleteSubCategory = catchAsync(
    async (req: Request, res: Response) => {
      const subCategoryId = req.params.id;
      const productId = req.params.productId;

      const result = await this.#SubCategoryService.deleteSubCategory(
        productId,
        subCategoryId
      );

      responseReturn(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Sub Category Removed Successfully!',
        data: result,
      });
    }
  );

  // get subcategories from category method
  readonly allSubCategoriesUnderCategories = catchAsync(
    async (_req: Request, res: Response) => {
      const result =
        await this.#SubCategoryService.allSubCategoriesUnderCategories();

      responseReturn(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'All  Categories Retrieved Successfully!',
        data: result,
      });
    }
  );
}

export const SubCategoryController = new SubCategoryControllerClass(
  SubCategoryService
);
