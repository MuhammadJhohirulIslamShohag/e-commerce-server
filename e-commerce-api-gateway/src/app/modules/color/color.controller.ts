import { Request, Response } from 'express';

import catchAsync from '../../../shared/catchAsync';
import responseReturn from '../../../shared/responseReturn';

import { ColorService } from './color.service';

class ColorControllerClass {
  #ColorService: typeof ColorService;

  constructor(service: typeof ColorService) {
    this.#ColorService = service;
  }

  // create color controller
  readonly createColor = catchAsync(
    async (req: Request, res: Response) => {
      const result = await this.#ColorService.createColor(
        req
      );

      responseReturn(res, result);
    }
  );

  // get all colors controller
  readonly allColors = catchAsync(
    async (req: Request, res: Response) => {
      const result = await this.#ColorService.allColors(
        req
      );

      responseReturn(res, result);
    }
  );

  // get single color user controller
  readonly getSingleColor = catchAsync(
    async (req: Request, res: Response) => {
      const result =
        await this.#ColorService.getSingleColor(req);

      responseReturn(res, result);
    }
  );

  // update color controller
  readonly updateColor = catchAsync(
    async (req: Request, res: Response) => {
      const result = await this.#ColorService.updateColor(
        req
      );

      responseReturn(res, result);
    }
  );

  // delete color controller
  readonly deleteColor = catchAsync(
    async (req: Request, res: Response) => {
      const result = await this.#ColorService.deleteColor(
        req
      );

      responseReturn(res, result);
    }
  );
}

export const ColorController = new ColorControllerClass(
  ColorService
);
