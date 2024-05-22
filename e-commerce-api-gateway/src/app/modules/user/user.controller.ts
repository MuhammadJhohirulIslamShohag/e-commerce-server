import { Request, Response } from 'express';

import catchAsync from '../../../shared/catchAsync';
import responseReturn from '../../../shared/responseReturn';

import { UserService } from './user.service';

class UserControllerClass {
  #UserService: typeof UserService;

  constructor(service: typeof UserService) {
    this.#UserService = service;
  }

  // get all users method
  readonly allUsers = catchAsync(async (req: Request, res: Response) => {
    const result = await this.#UserService.allUsers(req);

    responseReturn(res, result);
  });

  // get single user method
  readonly getSingleUser = catchAsync(async (req: Request, res: Response) => {
    const result = await this.#UserService.getSingleUser(req);
    responseReturn(res, result);
  });

  // update user method
  readonly updateUser = catchAsync(async (req: Request, res: Response) => {
    const result = await this.#UserService.updateUser(req);
    responseReturn(res, result);
  });

  // add shipping address user method
  readonly addShippingAddressToUser = catchAsync(
    async (req: Request, res: Response) => {
      const result = await this.#UserService.addShippingAddressToUser(req);
      responseReturn(res, result);
    }
  );

  // update shipping address user method
  readonly updateShippingAddressToUser = catchAsync(
    async (req: Request, res: Response) => {
      const result = await this.#UserService.updateShippingAddressToUser(req);
      responseReturn(res, result);
    }
  );

  // shipping address controller
  readonly addShippingAddress = catchAsync(
    async (req: Request, res: Response) => {
      const result = await this.#UserService.addShippingAddress(req);
      responseReturn(res, result);
    }
  );

  // update shipping address user method
  readonly deleteShippingAddressToUser = catchAsync(
    async (req: Request, res: Response) => {
      const result = await this.#UserService.deleteShippingAddressToUser(req);
      responseReturn(res, result);
    }
  );

  // delete user method
  readonly deleteUser = catchAsync(async (req: Request, res: Response) => {
    const result = await this.#UserService.deleteUser(req);
    responseReturn(res, result);
  });

  // add save wish list method
  readonly addWishListProduct = catchAsync(
    async (req: Request, res: Response) => {
      const result = await this.#UserService.addWishListProduct(req);
      responseReturn(res, result);
    }
  );

  // delete wish list method
  readonly deleteProductFromWishlist = catchAsync(
    async (req: Request, res: Response) => {
      const result = await this.#UserService.deleteProductFromWishlist(req);
      responseReturn(res, result);
    }
  );
}

export const UserController = new UserControllerClass(UserService);
