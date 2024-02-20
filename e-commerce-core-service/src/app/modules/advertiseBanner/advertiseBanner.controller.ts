import { Request, Response } from 'express';
import httpStatus from 'http-status';

import catchAsync from '../../shared/catchAsync';
import responseReturn from '../../shared/responseReturn';

import { AdvertiseBannerService } from './advertiseBanner.service';
import { validateRequireFields } from '../../shared/validateRequireFields';
import { ImageUploadHelpers } from '../../helpers/image-upload.helper';

class AdvertiseBannerControllerClass {
  #AdvertiseBannerService: typeof AdvertiseBannerService;

  constructor(service: typeof AdvertiseBannerService) {
    this.#AdvertiseBannerService = service;
  }

  // create advertise banner controller
  readonly createAdvertiseBanner = catchAsync(
    async (req: Request, res: Response) => {
      const { name, startDate, duration, endDate, ...other } = req.body;

      // validate body data
      await validateRequireFields({ name, startDate, duration, endDate });

      // advertise banner image file
      const advertiseBannerImageFile =
        await ImageUploadHelpers.imageFileValidate(
          req,
          'advertiseBannerImage',
          'advertiseBanner'
        );

      // advertiseBanner data
      const advertiseBannerObjStructure = {
        name,
        startDate,
        duration,
        endDate,
        imageURL: advertiseBannerImageFile,
        ...other,
      };

      const result = await this.#AdvertiseBannerService.createAdvertiseBanner(
        advertiseBannerObjStructure
      );

      responseReturn(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Advertise Banner Created Successfully!',
        data: result,
      });
    }
  );

  // get all advertise banners controller
  readonly allAdvertiseBanners = catchAsync(
    async (req: Request, res: Response) => {
      const result = await this.#AdvertiseBannerService.allAdvertiseBanners(
        req.query
      );

      responseReturn(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'All Advertise Banners Retrieved Successfully!',
        data: result.result,
        meta: result.meta,
      });
    }
  );

  // get single advertise banner user controller
  readonly getSingleAdvertiseBanner = catchAsync(
    async (req: Request, res: Response) => {
      const advertiseBannerId = req.params.id;
      const result =
        await this.#AdvertiseBannerService.getSingleAdvertiseBanner(
          advertiseBannerId
        );

      responseReturn(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Single Advertise Banner Retrieved Successfully!',
        data: result,
      });
    }
  );

  // update advertise banner controller
  readonly updateAdvertiseBanner = catchAsync(
    async (req: Request, res: Response) => {
      const advertiseBannerId = req.params.id;
      const { ...updateAdvertiseBannerData } = req.body;

      const result = await this.#AdvertiseBannerService.updateAdvertiseBanner(
        advertiseBannerId,
        updateAdvertiseBannerData
      );

      responseReturn(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Advertise Banner Updated Successfully!',
        data: result,
      });
    }
  );

  // delete advertise banner controller
  readonly deleteAdvertiseBanner = catchAsync(
    async (req: Request, res: Response) => {
      const advertiseBannerId = req.params.id;

      const result = await this.#AdvertiseBannerService.deleteAdvertiseBanner(
        advertiseBannerId
      );

      responseReturn(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Advertise Banner Removed Successfully!',
        data: result,
      });
    }
  );
}

export const AdvertiseBannerController = new AdvertiseBannerControllerClass(
  AdvertiseBannerService
);
