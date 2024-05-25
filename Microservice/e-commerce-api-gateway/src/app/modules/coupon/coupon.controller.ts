import { Request, Response } from 'express';

import catchAsync from '../../../shared/catchAsync';
import responseReturn from '../../../shared/responseReturn';

import { CouponService } from './coupon.service';

class CouponControllerClass {
  #CouponService: typeof CouponService;

  constructor(service: typeof CouponService) {
    this.#CouponService = service;
  }

  // create coupon controller
  readonly createCoupon = catchAsync(async (req: Request, res: Response) => {
    const result = await this.#CouponService.createCoupon(req);

    responseReturn(res, result);
  });

  // get all coupons controller
  readonly allCoupons = catchAsync(async (req: Request, res: Response) => {
    const result = await this.#CouponService.allCoupons(req);

    responseReturn(res, result);
  });

  // get single coupon user controller
  readonly getSingleCoupon = catchAsync(async (req: Request, res: Response) => {
    const result = await this.#CouponService.getSingleCoupon(req);

    responseReturn(res, result);
  });

  // update coupon controller
  readonly updateCoupon = catchAsync(async (req: Request, res: Response) => {
    const result = await this.#CouponService.updateCoupon(req);

    responseReturn(res, result);
  });

  // delete coupon controller
  readonly deleteCoupon = catchAsync(async (req: Request, res: Response) => {
    const result = await this.#CouponService.deleteCoupon(req);

    responseReturn(res, result);
  });
}

export const CouponController = new CouponControllerClass(CouponService);
