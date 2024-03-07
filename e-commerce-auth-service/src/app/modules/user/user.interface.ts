import { Model, Types } from 'mongoose';

// user role enum
type UserRoleType = 'user';

type UserAddress = {
  presentAddress: string;
  permanentAddress: string;
  location: string;
};

export type ShippingAddress = {
  firstName: string;
  lastName: string;
  company: string;
  address1: string;
  address2: string;
  city: string;
  postCode: string;
  country: string;
  state: string;
  defaultAddress: boolean;
  shippingAddressId?: string;
};

// shipping address interface model type
export type IShippingAddress = {
  recipientName: string;
  streetAddress: string;
  city: string;
  stateProvince: string;
  postalCode: string;
  country: string;
  phoneNumber: string;
};

type OrderAddress = {
  fullName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  stateProvince: string;
  postalCode: string;
  country: string;
  phoneNumber: string;
};

export type IUser = {
  _id?: string;
  name?: string;
  phone: string;
  phoneNumberVerified: boolean;
  email: string;
  location: string;
  wishList: {
    productId: Types.ObjectId;
  };
  emailVerified: boolean;
  password: string;
  profileImage?: string;
  address: UserAddress;
  shippingAddress: ShippingAddress[];
  orderAddress: OrderAddress;
  role: UserRoleType;
};

export type UserModel = Model<IUser>;

// user filterable filed
export type UserFilters = {
  searchTerm?: string;
};
