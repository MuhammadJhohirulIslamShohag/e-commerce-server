import { Request, Response } from 'express';
import httpStatus from 'http-status';

import catchAsync from '../../shared/catchAsync';
import responseReturn from '../../shared/responseReturn';

import { BannerService } from './banner.service';
import { validateRequireFields } from '../../shared/validateRequireFields';
import { ImageUploadHelpers } from '../../helpers/image-upload.helper';

class BannerControllerClass {
  #BannerService: typeof BannerService;

  constructor(service: typeof BannerService) {
    this.#BannerService = service;
  }

  // create banner controller
  readonly createBanner = catchAsync(async (req: Request, res: Response) => {
    const { offer } = req.body;

    // validate body data
    await validateRequireFields({ offer });

    // banner image file
    const bannerImageFile = await ImageUploadHelpers.imageFileValidate(
      req,
      'bannerImage',
      'banner'
    );

    // banner data
    const bannerObjStructure = {
      offer,
      imageURL: bannerImageFile,
    };

    const result = await this.#BannerService.createBanner(bannerObjStructure);

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

  // get single banner user controller
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
