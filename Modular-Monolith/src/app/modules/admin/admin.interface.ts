import { Model, Types } from 'mongoose';

// admin role enum
type RoleType = 'admin' | 'seller';
// admin status enum
type StatusType = 'active' | 'inActive' | 'terminated';

export type TShippingAddress = {
  firstName: string;
  lastName: string;
  address1: string;
  address2: string;
  city: string;
  postCode: string;
  country: string;
  state: string;
  phoneNumber: string;
};

export type IAdmin = {
  _id?: string;
  name?: string;
  email: string;
  about: string;
  wishLists: {
    productId: Types.ObjectId;
  };
  password: string;
  profileImage?: string;
  shippingAddress: TShippingAddress;
  role: RoleType;
  status: StatusType;
};

// admin model type
export type AdminModel = Model<IAdmin>;

export type IRegister = {
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

// admin filterable filed
export type AdminFilters = {
  searchTerm?: string;
};
