import { Request, Response } from 'express';

import catchAsync from '../../../shared/catchAsync';
import responseReturn from '../../../shared/responseReturn';

import { CartService } from './cart.service';

class CartControllerClass {
  #CartService: typeof CartService;

  constructor(service: typeof CartService) {
    this.#CartService = service;
  }

  // create cart controller
  readonly createCart = catchAsync(
    async (req: Request, res: Response) => {
      const result = await this.#CartService.createCart(
        req
      );

      responseReturn(res, result);
    }
  );

  // get all carts controller
  readonly allCarts = catchAsync(
    async (req: Request, res: Response) => {
      const result = await this.#CartService.allCarts(
        req
      );

      responseReturn(res, result);
    }
  );

  // get user carts controller
  readonly userCarts = catchAsync(
    async (req: Request, res: Response) => {
      const result = await this.#CartService.userCarts(
        req
      );

      responseReturn(res, result);
    }
  );


  // delete cart controller
  readonly deleteCart = catchAsync(
    async (req: Request, res: Response) => {
      const result = await this.#CartService.deleteCart(
        req
      );

      responseReturn(res, result);
    }
  );
}

export const CartController = new CartControllerClass(
  CartService
);
