import { Model, Types } from 'mongoose';

// user role enum
type UserRoleType = 'user';

export type TShippingAddress = {
  firstName: string;
  lastName: string;
  company: string;
  address1: string;
  address2: string;
  city: string;
  postCode: string;
  country: string;
  state: string;
  phoneNumber: string;
};

export type IUser = {
  _id?: string;
  name?: string;
  email: string;
  location: string;
  about: string;
  wishLists: {
    productId: Types.ObjectId;
  };
  emailVerified: boolean;
  password: string;
  profileImage?: string;
  shippingAddress: TShippingAddress;
  role: UserRoleType;
};

export type ICreateUser = {
  name: string;
  email: string;
  password: string;
  otp: number;
};

export type TForgotPassword = {
  email: string;
  password: string;
  otp: number;
};

export type UserModel = Model<IUser>;

// user filterable filed
export type UserFilters = {
  searchTerm?: string;
};
