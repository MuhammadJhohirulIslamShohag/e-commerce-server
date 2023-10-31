/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-unused-vars */
import { Model, Types } from 'mongoose';

export type UserRoleType = 'user' | 'admin';

export type IUser = {
  _id: string;
  username: string;
  fullName: string;
  email: string;
  image: {
    url: string;
    public_id: string;
  };
  password: string;
  role: UserRoleType;
  cart: any;
  about: string;
  address: {
    fullName: {
      type: string;
    };
    address: {
      type: string;
    };
    city: {
      type: string;
    };
    postalCode: {
      type: string;
    };
    country: {
      type: string;
    };
  };
  wishList: {
    product: Types.ObjectId;
    isWishList: boolean;
  };
};

export type UserModel = {
  isUserExit(
    phoneNumber: string
  ): Promise<Pick<IUser, 'email' | 'password' | 'role' | '_id'> | null>;
  isPasswordMatched(
    savedPassword: string,
    givenPassword: string
  ): Promise<boolean>;
} & Model<IUser>;

export type ILoginResponse = {
  accessToken: string;
  refreshToken: string;
};

export type UserFilterOptionType = {
  searchTerm?: string;
};
