import { Request, Response } from 'express';

import catchAsync from '../../../shared/catchAsync';
import responseReturn from '../../../shared/responseReturn';

import { BrandService } from './brand.service';

class BrandControllerClass {
  #BrandService: typeof BrandService;

  constructor(service: typeof BrandService) {
    this.#BrandService = service;
  }

  // create brand controller
  readonly createBrand = catchAsync(
    async (req: Request, res: Response) => {
      const result = await this.#BrandService.createBrand(
        req
      );

      responseReturn(res, result);
    }
  );

  // get all brands controller
  readonly allBrands = catchAsync(
    async (req: Request, res: Response) => {
      const result = await this.#BrandService.allBrands(
        req
      );

      responseReturn(res, result);
    }
  );

  // get single brand user controller
  readonly getSingleBrand = catchAsync(
    async (req: Request, res: Response) => {
      const result =
        await this.#BrandService.getSingleBrand(req);

      responseReturn(res, result);
    }
  );

  // update brand controller
  readonly updateBrand = catchAsync(
    async (req: Request, res: Response) => {
      const result = await this.#BrandService.updateBrand(
        req
      );

      responseReturn(res, result);
    }
  );

  // delete brand controller
  readonly deleteBrand = catchAsync(
    async (req: Request, res: Response) => {
      const result = await this.#BrandService.deleteBrand(
        req
      );

      responseReturn(res, result);
    }
  );
}

export const BrandController = new BrandControllerClass(
  BrandService
);
