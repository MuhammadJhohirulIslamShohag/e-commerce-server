import { Request, Response } from 'express';
import httpStatus from 'http-status';

import { ColorService } from './color.service';
import catchAsync from '../../shared/catchAsync';
import responseReturn from '../../shared/responseReturn';

class ColorControllerClass {
  #ColorService: typeof ColorService;

  constructor(service: typeof ColorService) {
    this.#ColorService = service;
  }

  // create color controller
  readonly createColor = catchAsync(async (req: Request, res: Response) => {
    const { ...colorData } = req.body;

    const result = await this.#ColorService.createColor(colorData);

    responseReturn(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Color Created Successfully!',
      data: result,
    });
  });

  // get all colors controller
  readonly allColors = catchAsync(async (req: Request, res: Response) => {
    const result = await this.#ColorService.allColors(req.query);

    responseReturn(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'All Colors Retrieved Successfully!',
      data: result.result,
      meta: result.meta,
    });
  });

  // get single color user controller
  readonly getSingleColor = catchAsync(async (req: Request, res: Response) => {
    const colorId = req.params.id;

    const result = await this.#ColorService.getSingleColor(colorId);

    responseReturn(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Single Color Retrieved Successfully!',
      data: result,
    });
  });

  // update color controller
  readonly updateColor = catchAsync(async (req: Request, res: Response) => {
    const colorId = req.params.id;
    const { ...updateColorData } = req.body;

    const result = await this.#ColorService.updateColor(
      colorId,
      updateColorData
    );

    responseReturn(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Color Updated Successfully!',
      data: result,
    });
  });

  // delete color controller
  readonly deleteColor = catchAsync(async (req: Request, res: Response) => {
    const colorId = req.params.id;
    const result = await this.#ColorService.deleteColor(colorId);

    responseReturn(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Color Removed Successfully!',
      data: result,
    });
  });
}

export const ColorController = new ColorControllerClass(ColorService);
