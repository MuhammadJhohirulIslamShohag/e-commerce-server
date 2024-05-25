import { Request, Response } from 'express';

import catchAsync from '../../../shared/catchAsync';
import responseReturn from '../../../shared/responseReturn';

import { SubCategoryService } from './subCategory.service';

class SubCategoryControllerClass {
  #SubCategoryService: typeof SubCategoryService;

  constructor(service: typeof SubCategoryService) {
    this.#SubCategoryService = service;
  }

  // create sub category controller
  readonly createSubCategory = catchAsync(
    async (req: Request, res: Response) => {
      const result = await this.#SubCategoryService.createSubCategory(req);

      responseReturn(res, result);
    }
  );

  // get all sub category controller
  readonly allSubCategories = catchAsync(
    async (req: Request, res: Response) => {
      const result = await this.#SubCategoryService.allSubCategories(req);

      responseReturn(res, result);
    }
  );

  // get single sub category user controller
  readonly getSingleSubCategory = catchAsync(
    async (req: Request, res: Response) => {
      const result = await this.#SubCategoryService.getSingleSubCategory(req);

      responseReturn(res, result);
    }
  );

  // update sub category controller
  readonly updateSubCategory = catchAsync(
    async (req: Request, res: Response) => {
      const result = await this.#SubCategoryService.updateSubCategory(req);

      responseReturn(res, result);
    }
  );

  // delete sub category controller
  readonly deleteSubCategory = catchAsync(
    async (req: Request, res: Response) => {
      const result = await this.#SubCategoryService.deleteSubCategory(req);

      responseReturn(res, result);
    }
  );
}

export const SubCategoryController = new SubCategoryControllerClass(
  SubCategoryService
);
