import { Request, Response } from 'express';

import httpStatus from 'http-status';
import catchAsync from '../../shared/catchAsync';
import responseReturn from '../../shared/responseReturn';

import { SizeService } from './size.service';

class SizeControllerClass {
  #SizeService: typeof SizeService;

  constructor(service: typeof SizeService) {
    this.#SizeService = service;
  }

  // create size controller
  readonly createSize = catchAsync(async (req: Request, res: Response) => {
    const { ...sizeData } = req.body;

    const result = await this.#SizeService.createSize(sizeData);

    responseReturn(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Size Created Successfully!',
      data: result,
    });
  });

  // get all sizes controller
  readonly allSizes = catchAsync(async (req: Request, res: Response) => {
    const result = await this.#SizeService.allSizes(req.query);

    responseReturn(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'All Sizes Retrieved Successfully!',
      data: result.result,
      meta: result.meta,
    });
  });

  // get single Size user controller
  readonly getSingleSize = catchAsync(async (req: Request, res: Response) => {
    const sizeId = req.params.id;

    const result = await this.#SizeService.getSingleSize(sizeId);

    responseReturn(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Single Size Retrieved Successfully!',
      data: result,
    });
  });

  // update size controller
  readonly updateSize = catchAsync(async (req: Request, res: Response) => {
    const sizeId = req.params.id;
    const { ...updateSizeData } = req.body;

    const result = await this.#SizeService.updateSize(sizeId, updateSizeData);

    responseReturn(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Size Updated Successfully!',
      data: result,
    });
  });

  // delete Size controller
  readonly deleteSize = catchAsync(async (req: Request, res: Response) => {
    const sizeId = req.params.id;
    
    const result = await this.#SizeService.deleteSize(sizeId);

    responseReturn(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Size Removed Successfully!',
      data: result,
    });
  });
}

export const SizeController = new SizeControllerClass(SizeService);
