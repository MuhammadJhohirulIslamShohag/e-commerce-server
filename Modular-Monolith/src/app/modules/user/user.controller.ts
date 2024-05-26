import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';

import catchAsync from '../../shared/catchAsync';
import responseReturn from '../../shared/responseReturn';

import { UserService } from './user.service';
import { ImageUploadHelpers } from '../../helpers/image-upload.helper';
import { TFileRequestBody } from '../../interfaces/common';

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

  // update shipping address user method
  // readonly updateShippingAddressToUser = catchAsync(
  //   async (req: Request, res: Response) => {
  //     const { userId } = req.user as JwtPayload;
  //     const { ...updateShippingAddressData } = req.body;

  //     const result = await this.#UserService.updateShippingAddressToUser(
  //       userId,
  //       updateShippingAddressData
  //     );

  //     responseReturn(res, {
  //       statusCode: httpStatus.OK,
  //       success: true,
  //       message: 'Update Shipping Address To User Successfully!',
  //       data: result,
  //     });
  //   }
  // );

  readonly uploadProfileImage = catchAsync(
    async (req: Request, res: Response) => {

     
      const { userId } = req.user as JwtPayload;

      // profile image file
      const profileImageFile = await ImageUploadHelpers.imageFileValidate(
        req.files as unknown as TFileRequestBody,
        'profileImage',
        'profile'
      );

      const result = await this.#UserService.uploadProfileImage(
        profileImageFile,
        userId
      );

      responseReturn(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Profile Image Uploaded Successfully!',
        data: result,
      });
    }
  );
}

export const UserController = new UserControllerClass(UserService);
