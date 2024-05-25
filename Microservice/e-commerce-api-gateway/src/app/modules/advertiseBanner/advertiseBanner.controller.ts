import { Request, Response } from 'express';

import catchAsync from '../../../shared/catchAsync';
import responseReturn from '../../../shared/responseReturn';

import { AdvertiseBannerService } from './advertiseBanner.service';

class AdvertiseBannerControllerClass {
  #AdvertiseBannerService: typeof AdvertiseBannerService;

  constructor(service: typeof AdvertiseBannerService) {
    this.#AdvertiseBannerService = service;
  }

  // create advertise banner controller
  readonly createAdvertiseBanner = catchAsync(
    async (req: Request, res: Response) => {
      const result = await this.#AdvertiseBannerService.createAdvertiseBanner(
        req
      );

      responseReturn(res, result);
    }
  );

  // get all advertise banners controller
  readonly allAdvertiseBanners = catchAsync(
    async (req: Request, res: Response) => {
      const result = await this.#AdvertiseBannerService.allAdvertiseBanners(
        req
      );

      responseReturn(res, result);
    }
  );

  // get single advertise banner user controller
  readonly getSingleAdvertiseBanner = catchAsync(
    async (req: Request, res: Response) => {
      const result =
        await this.#AdvertiseBannerService.getSingleAdvertiseBanner(req);

      responseReturn(res, result);
    }
  );

  // update advertise banner controller
  readonly updateAdvertiseBanner = catchAsync(
    async (req: Request, res: Response) => {
      const result = await this.#AdvertiseBannerService.updateAdvertiseBanner(
        req
      );

      responseReturn(res, result);
    }
  );

  // delete advertise banner controller
  readonly deleteAdvertiseBanner = catchAsync(
    async (req: Request, res: Response) => {
      const result = await this.#AdvertiseBannerService.deleteAdvertiseBanner(
        req
      );

      responseReturn(res, result);
    }
  );
}

export const AdvertiseBannerController = new AdvertiseBannerControllerClass(
  AdvertiseBannerService
);
