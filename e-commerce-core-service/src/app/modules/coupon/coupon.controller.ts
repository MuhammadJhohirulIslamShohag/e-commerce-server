import { Request, Response } from 'express';

import httpStatus from 'http-status';
import catchAsync from '../../shared/catchAsync';
import ApiError from '../../errors/ApiError';
import responseReturn from '../../shared/responseReturn';

import { CouponService } from './coupon.service';

class CouponControllerClass {
  #CouponService: typeof CouponService;

  constructor(service: typeof CouponService) {
    this.#CouponService = service;
  }

  // create Coupon controller
  readonly createCoupon = catchAsync(async (req: Request, res: Response) => {
    const { ...couponData } = req.body;
    const result = await this.#CouponService.createCoupon(couponData);

    // if not created coupon, throw error
    if (!result) {
      throw new ApiError(httpStatus.BAD_REQUEST, `Coupon Create Failed!`);
    }

    responseReturn(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Coupon Created Successfully!',
      data: result,
    });
  });

  // get all coupons controller
  readonly allCoupons = catchAsync(async (req: Request, res: Response) => {
    const result = await this.#CouponService.allCoupons(req.query);

    responseReturn(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'All Coupons Retrieved Successfully!',
      data: result.result,
      meta: result.meta,
    });
  });

  // get single Coupon user controller
  readonly getSingleCoupon = catchAsync(async (req: Request, res: Response) => {
    const couponId = req.params.id;
    const result = await this.#CouponService.getSingleCoupon(couponId);

    responseReturn(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Single Coupon Retrieved Successfully!',
      data: result,
    });
  });

  // update Coupon controller
  readonly updateCoupon = catchAsync(async (req: Request, res: Response) => {
    const couponId = req.params.id;
    const { ...updateCouponData } = req.body;
    const result = await this.#CouponService.updateCoupon(
      couponId,
      updateCouponData
    );

    responseReturn(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Coupon Updated Successfully!',
      data: result,
    });
  });

  // delete coupon controller
  readonly deleteCoupon = catchAsync(async (req: Request, res: Response) => {
    const couponId = req.params.id;
    const result = await this.#CouponService.deleteCoupon(couponId);

    responseReturn(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Coupon Removed Successfully!',
      data: result,
    });
  });
}

export const CouponController = new CouponControllerClass(CouponService);
