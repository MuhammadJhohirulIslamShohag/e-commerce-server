import { Request } from 'express';
import { CoreService } from '../../../shared/axios';
import { IGenericResponse } from '../../../interfaces/common';

class CouponServiceClass {
  #CoreService;
  constructor() {
    this.#CoreService = CoreService;
  }

  // create coupon service
  readonly createCoupon = async (req: Request) => {
    const response: IGenericResponse = await this.#CoreService.post(
      `coupons`,
      req.body,
      {
        headers: {
          Authorization: req.headers.authorization,
        },
      }
    );
    return response;
  };

  // get all coupons service
  readonly allCoupons = async (req: Request) => {
    const response: IGenericResponse = await CoreService.get(`coupons`, {
      params: req.query,
      headers: {
        Authorization: req.headers.authorization,
      },
    });
    return response;
  };

  // get single coupon service
  readonly getSingleCoupon = async (req: Request) => {
    const { id } = req.params;

    const response: IGenericResponse = await CoreService.get(`coupons/${id}`, {
      headers: {
        Authorization: req.headers.authorization,
      },
    });
    return response;
  };

  // update coupon service
  readonly updateCoupon = async (req: Request) => {
    const { id } = req.params;

    const response: IGenericResponse = await CoreService.patch(
      `coupons/${id}`,
      req.body,
      {
        headers: {
          Authorization: req.headers.authorization,
        },
      }
    );
    return response;
  };

  // delete coupon service
  readonly deleteCoupon = async (req: Request) => {
    const { id } = req.params;

    const response: IGenericResponse = await CoreService.delete(
      `coupons/${id}`,
      {
        headers: {
          Authorization: req.headers.authorization,
        },
      }
    );
    return response;
  };
}

export const CouponService = new CouponServiceClass();
