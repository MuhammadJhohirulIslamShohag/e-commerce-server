import { Router } from 'express';
import validateRequest from '../../middlewares/validateRequest';
import auth from '../../middlewares/auth';

import { CouponValidation } from './coupon.validation';
import { CouponController } from './coupon.controller';
import { ENUM_USER_ROLE } from '../../enum/user';

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
        auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SELLER),
        validateRequest(CouponValidation.couponCreateZodSchema),
        CouponController.createCoupon
      )
      .get(
        auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SELLER),
        CouponController.allCoupons
      );

    // update and get single coupon, delete routes
    this.routers
      .route('/:id')
      .patch(
        auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SELLER),
        validateRequest(CouponValidation.couponUpdateZodSchema),
        CouponController.updateCoupon
      )
      .get(
        auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SELLER),
        CouponController.getSingleCoupon
      )
      .delete(
        auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SELLER),
        CouponController.deleteCoupon
      );
  }
}

const allRoutes = new CouponRouterClass().routers;

export { allRoutes as CouponRoutes };
