import { Request, Response } from 'express';

import catchAsync from '../../../shared/catchAsync';
import responseReturn from '../../../shared/responseReturn';

import { SizeService } from './size.service';

class SizeControllerClass {
  #SizeService: typeof SizeService;

  constructor(service: typeof SizeService) {
    this.#SizeService = service;
  }

  // create size controller
  readonly createSize = catchAsync(
    async (req: Request, res: Response) => {
      const result = await this.#SizeService.createSize(
        req
      );

      responseReturn(res, result);
    }
  );

  // get all sizes controller
  readonly allSizes = catchAsync(
    async (req: Request, res: Response) => {
      const result = await this.#SizeService.allSizes(
        req
      );

      responseReturn(res, result);
    }
  );

  // get single size user controller
  readonly getSingleSize = catchAsync(
    async (req: Request, res: Response) => {
      const result =
        await this.#SizeService.getSingleSize(req);

      responseReturn(res, result);
    }
  );

  // update size controller
  readonly updateSize = catchAsync(
    async (req: Request, res: Response) => {
      const result = await this.#SizeService.updateSize(
        req
      );

      responseReturn(res, result);
    }
  );

  // delete size controller
  readonly deleteSize = catchAsync(
    async (req: Request, res: Response) => {
      const result = await this.#SizeService.deleteSize(
        req
      );

      responseReturn(res, result);
    }
  );
}

export const SizeController = new SizeControllerClass(
  SizeService
);
