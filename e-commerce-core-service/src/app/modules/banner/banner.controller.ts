import { Request, Response } from 'express';
import httpStatus from 'http-status';

import { BannerService } from './banner.service';
import catchAsync from '../../shared/catchAsync';
import responseReturn from '../../shared/responseReturn';

class BannerControllerClass {
  #BannerService: typeof BannerService;

  constructor(service: typeof BannerService) {
    this.#BannerService = service;
  }

  // create banner controller
  readonly createBanner = catchAsync(async (req: Request, res: Response) => {
    const { ...bannerData } = req.body;

    const result = await this.#BannerService.createBanner(bannerData);

    responseReturn(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Banner Image Created Successfully!',
      data: result,
    });
  });

  // get all banners controller
  readonly allBanners = catchAsync(async (req: Request, res: Response) => {
    const result = await this.#BannerService.allBanners(req.query);

    responseReturn(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'All Banners Retrieved Successfully!',
      data: result.result,
      meta: result.meta,
    });
  });

  // get single Banner user controller
  readonly getSingleBanner = catchAsync(async (req: Request, res: Response) => {
    const bannerId = req.params.id;

    const result = await this.#BannerService.getSingleBanner(bannerId);

    responseReturn(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Single Banner Image Retrieved Successfully!',
      data: result,
    });
  });

  // update banner controller
  readonly updateBanner = catchAsync(async (req: Request, res: Response) => {
    const bannerId = req.params.id;
    const { ...updateBannerData } = req.body;

    const result = await this.#BannerService.updateBanner(
      bannerId,
      updateBannerData
    );

    responseReturn(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Banner Image Updated Successfully!',
      data: result,
    });
  });

  // delete banner controller
  readonly deleteBanner = catchAsync(async (req: Request, res: Response) => {
    const bannerId = req.params.id;

    const result = await this.#BannerService.deleteBanner(bannerId);

    responseReturn(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Banner Image Removed Successfully!',
      data: result,
    });
  });
}

export const BannerController = new BannerControllerClass(BannerService);
