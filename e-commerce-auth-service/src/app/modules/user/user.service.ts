import httpStatus from 'http-status';

import ApiError from '../../../errors/ApiError';
import User from './user.model';
import QueryBuilder from '../../../builder/query.builder';

import { IUser } from './user.interface';
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

    const { shippingAddress, ...userData } = userPayload;
    const updatedUserData: Partial<IUser> = { ...userData };

    // update name property
    if (shippingAddress && Object.keys(shippingAddress).length > 0) {
      Object.keys(shippingAddress).forEach(key => {
        const nameKey = `shippingAddress.${key}` as keyof Partial<IUser>;
        (updatedUserData as any)[nameKey] =
          shippingAddress[key as keyof typeof shippingAddress];
      });
    }

    // only admin update user role, so check roleData is admin, if admin, update the role
    if (userData.role && roleData === 'admin') {
      updatedUserData['role'] = userData.role;
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
