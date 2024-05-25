import { Router } from 'express';

import { CouponValidation } from './coupon.validation';
import { CouponController } from './coupon.controller';
import validateRequest from '../../middlewares/validateRequest';

class CouponRouterClass {
  readonly routers: Router;
  constructor() {
    this.routers = Router();
    this.#RouterAction();
  }

  #RouterAction() {
    // create and get all coupons routes
    this.routers
      .route('/')
      .post(
        validateRequest(CouponValidation.couponCreateZodSchema),
        CouponController.createCoupon
      )
      .get(CouponController.allCoupons);

    // update and get single coupon, delete routes
    this.routers
      .route('/:id')
      .patch(
        validateRequest(CouponValidation.couponUpdateZodSchema),
        CouponController.updateCoupon
      )
      .get(CouponController.getSingleCoupon)
      .delete(CouponController.deleteCoupon);
  }
}

const allRoutes = new CouponRouterClass().routers;

export { allRoutes as CouponRoutes };
