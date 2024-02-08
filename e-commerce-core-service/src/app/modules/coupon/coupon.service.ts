import httpStatus from 'http-status';

import QueryBuilder from '../../builder/query.builder';
import ApiError from '../../errors/ApiError';
import Coupon from './coupon.model';

import { ICoupon } from './coupon.interface';
import { couponSearchableFields } from './coupon.constant';

class CouponServiceClass {
  #CouponModel;
  #QueryBuilder: typeof QueryBuilder;
  constructor() {
    this.#CouponModel = Coupon;
    this.#QueryBuilder = QueryBuilder;
  }
  // create Coupon service
  readonly createCoupon = async (payload: ICoupon) => {
    // check already Coupon exit, if not, throw error
    const isExitCoupon = await this.#CouponModel.findOne({
      code: payload?.code,
    });

    // check already Coupon exit, throw error
    if (isExitCoupon) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Coupon already Exit!');
    }
    const result = await this.#CouponModel.create(payload);

    // if not created coupon, throw error
    if (!result) {
      throw new ApiError(httpStatus.BAD_REQUEST, `Coupon Create Failed!`);
    }
    
    return result;
  };

  // get all Coupons service
  readonly allCoupons = async (query: Record<string, unknown>) => {
    const userQuery = new this.#QueryBuilder(this.#CouponModel.find(), query)
      .search(couponSearchableFields)
      .filter()
      .sort()
      .paginate()
      .fields();

    // result of user
    const result = await userQuery.modelQuery;

    // get meta user
    const meta = await userQuery.countTotal();

    return {
      meta,
      result,
    };
  };

  // get single Coupon service
  readonly getSingleCoupon = async (payload: string) => {
    const result = await this.#CouponModel.findById(payload).exec();
    return result;
  };

  // update Coupon service
  readonly updateCoupon = async (id: string, payload: Partial<ICoupon>) => {
    // check already Coupon exit, if not throw error
    const isExitCoupon = await this.#CouponModel.findById({ _id: id });
    if (!isExitCoupon) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Coupon Not Found!');
    }

    const { ...updatedCouponData }: Partial<ICoupon> = payload;

    // update the Coupon
    let result = null;

    if (Object.keys(updatedCouponData).length) {
      result = await this.#CouponModel.findOneAndUpdate(
        { _id: id },
        { ...updatedCouponData },
        {
          new: true,
        }
      );
    }

    return result;
  };

  // delete Coupon service
  readonly deleteCoupon = async (payload: string) => {
    // check already Coupon exit, if not throw error
    const isExitCoupon = await this.#CouponModel.findById({ _id: payload });
    if (!isExitCoupon) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Coupon Not Found!');
    }

    // delete the Coupon
    const result = await this.#CouponModel.findByIdAndDelete(payload);
    return result;
  };
}

export const CouponService = new CouponServiceClass();
