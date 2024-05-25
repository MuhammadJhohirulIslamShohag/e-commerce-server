import { Request, Response } from 'express';

import catchAsync from '../../../shared/catchAsync';
import responseReturn from '../../../shared/responseReturn';

import { CategoryService } from './category.service';

class CategoryControllerClass {
  #CategoryService: typeof CategoryService;

  constructor(service: typeof CategoryService) {
    this.#CategoryService = service;
  }

  // create category controller
  readonly createCategory = catchAsync(async (req: Request, res: Response) => {
    const result = await this.#CategoryService.createCategory(req);

    responseReturn(res, result);
  });

  // get all categories controller
  readonly allCategories = catchAsync(async (req: Request, res: Response) => {
    const result = await this.#CategoryService.allCategories(req);

    responseReturn(res, result);
  });

  // get single category user controller
  readonly getSingleCategory = catchAsync(
    async (req: Request, res: Response) => {
      const result = await this.#CategoryService.getSingleCategory(req);

      responseReturn(res, result);
    }
  );

  // update category controller
  readonly updateCategory = catchAsync(async (req: Request, res: Response) => {
    const result = await this.#CategoryService.updateCategory(req);

    responseReturn(res, result);
  });

  // delete category controller
  readonly deleteCategory = catchAsync(async (req: Request, res: Response) => {
    const result = await this.#CategoryService.deleteCategory(req);

    responseReturn(res, result);
  });
}

export const CategoryController = new CategoryControllerClass(CategoryService);
