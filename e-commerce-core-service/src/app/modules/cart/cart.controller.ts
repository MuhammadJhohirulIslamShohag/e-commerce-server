import { Request, Response } from 'express';

import httpStatus from 'http-status';
import catchAsync from '../../shared/catchAsync';
import responseReturn from '../../shared/responseReturn';

import { CartService } from './cart.service';
import { JwtPayload } from 'jsonwebtoken';

class CartControllerClass {
  #CartService: typeof CartService;

  constructor(service: typeof CartService) {
    this.#CartService = service;
  }

  // create brand controller
  readonly createCart = catchAsync(async (req: Request, res: Response) => {
    const { ...cartData } = req.body;
    const { userId } = req.user as JwtPayload;

    const result = await this.#CartService.createCart(cartData, userId);

    responseReturn(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Cart Created Successfully!',
      data: result,
    });
  });

  // get all carts controller
  readonly allCarts = catchAsync(async (req: Request, res: Response) => {
    const result = await this.#CartService.allCarts(req.query);

    responseReturn(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'All Carts Retrieved Successfully!',
      data: result.result,
      meta: result.meta,
    });
  });

  // get user carts controller
  readonly userCarts = catchAsync(async (req: Request, res: Response) => {
    const result = await this.#CartService.userCarts(req.params.id);

    responseReturn(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'User Carts Retrieved Successfully!',
      data: result,
    });
  });

  // delete cart controller
  readonly deleteCart = catchAsync(async (req: Request, res: Response) => {
    const { userId } = req.user as JwtPayload;

    const result = await this.#CartService.deleteCart(userId);

    responseReturn(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Cart Removed Successfully!',
      data: result,
    });
  });
}

export const CartController = new CartControllerClass(CartService);
