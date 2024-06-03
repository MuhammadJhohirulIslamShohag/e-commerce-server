import { Request, Response } from 'express';
import httpStatus from 'http-status';

import catchAsync from '../../shared/catchAsync';
import responseReturn from '../../shared/responseReturn';

import { DashboardService } from './dashboard.service';

class DashboardControllerClass {
  #DashboardService: typeof DashboardService;

  constructor(service: typeof DashboardService) {
    this.#DashboardService = service;
  }

  // dash widget info controller
  readonly dashWidgetInfo = catchAsync(async (req: Request, res: Response) => {
    const result = await this.#DashboardService.dashWidgetInfo();

    responseReturn(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Getting Dash Widget Info Successfully!',
      data: result,
    });
  });
}

export const dashboardController = new DashboardControllerClass(
  DashboardService
);
