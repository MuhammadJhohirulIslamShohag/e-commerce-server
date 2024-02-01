import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';

import responseReturn from '../../../shared/responseReturn';
import catchAsync from '../../../shared/catchAsync';

import { UserService } from './user.service';

class UserControllerClass {
  #UserService: typeof UserService;

  constructor(service: typeof UserService) {
    this.#UserService = service;
  }

  // get all users method
  readonly allUsers = catchAsync(async (req: Request, res: Response) => {
    const result = await this.#UserService.allUsers(req.query);
    responseReturn(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'All Users Retrieved Successfully!',
      meta: result.meta,
      data: result.result,
    });
  });

  // get single user method
  readonly getSingleUser = catchAsync(async (req: Request, res: Response) => {
    const UserId = req.params.id;
    const result = await this.#UserService.getSingleUser(UserId);

    responseReturn(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Single User Retrieved Successfully!',
      data: result,
    });
  });

  // update user method
  readonly updateUser = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id;
    const { role } = req.user as JwtPayload;
    const { ...userData } = req.body;
    const result = await this.#UserService.updateUser(id, role, userData);

    responseReturn(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'User Updated Successfully!',
      data: result,
    });
  });

  // add shipping address user method
  readonly addShippingAddressToUser = catchAsync(
    async (req: Request, res: Response) => {
      const { userId } = req.user as JwtPayload;
      const { ...shippingAddressData } = req.body;
      const result = await this.#UserService.addShippingAddressToUser(
        userId,
        shippingAddressData
      );

      responseReturn(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Add Shipping Address To User Successfully!',
        data: result,
      });
    }
  );

  // update shipping address user method
  readonly updateShippingAddressToUser = catchAsync(
    async (req: Request, res: Response) => {
      const { userId } = req.user as JwtPayload;
      const { ...updateShippingAddressData } = req.body;

      const result = await this.#UserService.updateShippingAddressToUser(
        userId,
        updateShippingAddressData
      );

      responseReturn(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Update Shipping Address To User Successfully!',
        data: result,
      });
    }
  );

  // update shipping address user method
  readonly deleteShippingAddressToUser = catchAsync(
    async (req: Request, res: Response) => {
      const { userId } = req.user as JwtPayload;
      const id = req.params.id;

      const result = await this.#UserService.deleteShippingAddressToUser(
        userId,
        id
      );

      responseReturn(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Delete Shipping Address To User Successfully!',
        data: result,
      });
    }
  );

  // delete user method
  readonly deleteUser = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id;
    const result = await this.#UserService.deleteUser(id);

    responseReturn(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'User Delete Successfully!',
      data: result,
    });
  });

  // add save wish list method
  readonly addWishListProduct = catchAsync(
    async (req: Request, res: Response) => {
      const { userId } = req.user as JwtPayload;
      const { productId } = req.body;
      const result = await this.#UserService.addWishListProduct(
        userId,
        productId
      );
      responseReturn(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Add Wish List Product Successfully!',
        data: result,
      });
    }
  );

  // delete wish list method
  readonly deleteProductFromWishlist = catchAsync(
    async (req: Request, res: Response) => {
      const { userId } = req.user as JwtPayload;
      const { wishlistId } = req.params;

      const result = await this.#UserService.deleteProductFromWishlist(
        userId,
        wishlistId
      );
      responseReturn(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Wish List Product Deleted Successfully!',
        data: result,
      });
    }
  );
}

export const UserController = new UserControllerClass(UserService);
