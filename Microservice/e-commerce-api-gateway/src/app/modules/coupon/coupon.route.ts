import { Router } from 'express';

import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';

import { CouponController } from './coupon.controller';
import { ENUM_USER_ROLE } from '../../../enum/user';
import { CouponValidation } from './coupon.validation';

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
        auth(ENUM_USER_ROLE.ADMIN),
        validateRequest(CouponValidation.couponCreateZodSchema),
        CouponController.createCoupon
      )
      .get(CouponController.allCoupons);

    // update and get single coupon, delete routes
    this.routers
      .route('/:id')
      .patch(
        auth(ENUM_USER_ROLE.ADMIN),
        validateRequest(CouponValidation.couponUpdateZodSchema),
        CouponController.updateCoupon
      )
      .get(CouponController.getSingleCoupon)
      .delete(auth(ENUM_USER_ROLE.ADMIN), CouponController.deleteCoupon);
  }
}

const allRoutes = new CouponRouterClass().routers;

export { allRoutes as CouponRoutes };
