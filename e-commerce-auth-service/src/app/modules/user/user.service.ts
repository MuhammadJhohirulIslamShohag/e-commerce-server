/* eslint-disable no-unused-expressions */
/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose, { Types } from 'mongoose';
import httpStatus from 'http-status';
import bcrypt from 'bcrypt';

import config from '../../../config';
import ApiError from '../../../errors/ApiError';
import User from './user.model';
import QueryBuilder from '../../../builder/query.builder';

import { IUser, ShippingAddress } from './user.interface';
import { userSearchableFields } from './user.constant';

class UserServiceClass {
  #UserModel;
  #QueryBuilder: typeof QueryBuilder;

  constructor() {
    this.#UserModel = User;
    this.#QueryBuilder = QueryBuilder;
  }

  // get all users method
  readonly allUsers = async (query: Record<string, unknown>) => {
    const userQuery = new this.#QueryBuilder(this.#UserModel.find(), query)
      .search(userSearchableFields)
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

  // add shipping address method
  readonly addShippingAddressToUser = async (
    id: string,
    payload: ShippingAddress
  ) => {
    // check User is exit, if not throw error
    const isExitUser: any = await this.#UserModel.findOne({
      _id: id,
    });

    if (!isExitUser) {
      throw new ApiError(httpStatus.CONFLICT, 'User Not Exit!');
    }

    // start transaction
    let result = null;
    const session = await mongoose.startSession();
    try {
      // start a session for the transaction
      await session.startTransaction();

      // update defaultAddress if defaultAddress has true in shipping address
      if (payload.defaultAddress == true) {
        await this.#UserModel.updateMany(
          { _id: id, 'shippingAddress.defaultAddress': true },
          {
            $set: {
              'shippingAddress.$[elem].defaultAddress': false,
            },
          },
          {
            multi: true,
            arrayFilters: [{ 'elem.defaultAddress': true }],
            session,
          }
        );
      }

      // push User to product
      result = await this.#UserModel.findOneAndUpdate(
        { _id: id },
        {
          $push: {
            shippingAddress: {
              firstName: payload.firstName,
              lastName: payload.lastName,
              company: payload.company,
              address1: payload.address1,
              address2: payload.address2,
              city: payload.city,
              postCode: payload.postCode,
              country: payload.country,
              state: payload.state,
              defaultAddress: payload.defaultAddress,
            },
          },
        },
        {
          new: true,
          session,
        }
      );
      // commit the transaction
      await session.commitTransaction();
      await session.endSession();
    } catch (error) {
      await session.abortTransaction();
      await session.endSession();
    }

    return result;
  };

  // update shipping address method
  readonly updateShippingAddressToUser = async (
    id: string,
    payload: Partial<ShippingAddress>
  ) => {
    // check User is exit, if not throw error
    const isExitUser = await this.#UserModel.findOne({
      _id: id,
    });

    if (!isExitUser) {
      throw new ApiError(httpStatus.CONFLICT, 'User Not Exit!');
    }

    // update defaultAddress if defaultAddress has true in shipping address
    await this.#UserModel.updateMany(
      { _id: id, 'shippingAddress.defaultAddress': true },
      {
        $set: {
          'shippingAddress.$[elem].defaultAddress': false,
        },
      },
      {
        multi: true,
        arrayFilters: [{ 'elem.defaultAddress': true }],
      }
    );

    // show result data
    let result = null;

    // update shipping address single field
    if (payload && Object.keys(payload)?.length) {
      const { shippingAddressId, ...others } = payload;
      const objectId = new Types.ObjectId(shippingAddressId);

      const user: any = await this.#UserModel.findOne({ _id: id });

      const updateShippingAddressObj = user?.shippingAddress?.find(
        (shippingAddr: any) =>
          new Types.ObjectId(shippingAddr?._id).equals(objectId)
      );

      result = await this.#UserModel.findOneAndUpdate(
        { _id: id, 'shippingAddress._id': shippingAddressId },
        {
          $set: {
            'shippingAddress.$.firstName':
              others?.firstName || updateShippingAddressObj?.firstName,
            'shippingAddress.$.lastName':
              others?.lastName || updateShippingAddressObj?.lastName,
            'shippingAddress.$.company':
              others?.company || updateShippingAddressObj?.company,
            'shippingAddress.$.address1':
              others?.address1 || updateShippingAddressObj?.address1,
            'shippingAddress.$.address2':
              others?.address2 || updateShippingAddressObj?.address2,
            'shippingAddress.$.city':
              others?.city || updateShippingAddressObj?.city,
            'shippingAddress.$.postCode':
              others?.postCode || updateShippingAddressObj?.postCode,
            'shippingAddress.$.country':
              others?.country || updateShippingAddressObj?.country,
            'shippingAddress.$.state':
              others?.state || updateShippingAddressObj?.state,
            'shippingAddress.$.defaultAddress':
              others?.defaultAddress ||
              updateShippingAddressObj?.defaultAddress,
          },
        },
        {
          new: true,
        }
      );
    }

    return result;
  };

  // delete shipping address method
  readonly deleteShippingAddressToUser = async (
    id: string,
    payload: string
  ) => {
    // check User is exit, if not throw error
    const isExitUser = await this.#UserModel.findOne({
      _id: id,
    });

    if (!isExitUser) {
      throw new ApiError(httpStatus.CONFLICT, 'User Not Exit!');
    }

    const result = await this.#UserModel.findOneAndUpdate(
      { _id: id },
      {
        $pull: {
          shippingAddress: {
            _id: payload,
          },
        },
      },
      {
        new: true,
      }
    );

    return result;
  };

  // get single user method
  readonly getSingleUser = async (payload: string): Promise<IUser | null> => {
    const result = await this.#UserModel
      .findById(payload)
      .populate('wishList.productId');
    return result;
  };

  // update user method
  readonly updateUser = async (
    id: string,
    roleData: string,
    userPayload: Partial<IUser>
  ) => {
    // check user is exit, if not exit return error
    const isExit = await this.#UserModel.findOne({ _id: id });
    if (!isExit) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User not found!');
    }

    const { password, role, ...userData } = userPayload;
    const updatedUserData: Partial<IUser> = { ...userData };

    // only admin update user role, so check roleData is admin, if admin, update the role
    if (role && roleData === 'admin') {
      (updatedUserData as any)['role'] = role;
    }

    // if password field, have to hash password
    if (password) {
      (updatedUserData as any)[password] = await bcrypt.hash(
        password,
        Number(config?.bcrypt_salt_rounds)
      );
    }

    const result = await this.#UserModel.findOneAndUpdate(
      { _id: id },
      updatedUserData,
      {
        new: true,
      }
    );

    return result;
  };

  // delete user method
  readonly deleteUser = async (id: string) => {
    // check user is exit, if not exit return error
    const isExit = await this.#UserModel.findOne({ _id: id });
    if (!isExit) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User not found!');
    }

    const result = await this.#UserModel.findOneAndDelete({ _id: id });

    return result;
  };

  // add save wish list method
  readonly addWishListProduct = async (id: string, payload: string) => {
    const isUserExit = await this.#UserModel.findOne({ _id: id });

    // check user is exit, if not exit return error
    if (!isUserExit) {
      throw new ApiError(httpStatus.NOT_FOUND, 'You are authorized user!');
    }

    const isWishListExit = await this.#UserModel.findOne({
      'wishList.productId': payload,
    });

    // check wish list already is exit, if not exit return error
    if (isWishListExit) {
      throw new ApiError(
        httpStatus.CONFLICT,
        'You already added product to wish list!'
      );
    }

    // add new product id to wish list
    const result = await this.#UserModel.findOneAndUpdate(
      { _id: id },
      {
        $push: {
          wishList: {
            productId: payload,
          },
        },
      },
      {
        new: true,
      }
    );

    return result;
  };

  // delete wish list method
  readonly deleteProductFromWishlist = async (
    id: string,
    wishListId: string
  ) => {
    const isUserExit = await this.#UserModel.findOne({ _id: id });

    // check user is exit, if not exit return error
    if (!isUserExit) {
      throw new ApiError(httpStatus.NOT_FOUND, 'You are authorized user!');
    }

    // delete wish list from user
    const result = await this.#UserModel.findOneAndUpdate(
      { _id: id },
      {
        $pull: {
          wishList: {
            _id: wishListId,
          },
        },
      },
      {
        new: true,
      }
    );

    return result;
  };
}

export const UserService = new UserServiceClass();
