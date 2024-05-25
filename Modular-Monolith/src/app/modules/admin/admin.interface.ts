/* eslint-disable no-unused-vars */
import { Model } from 'mongoose';

// admin role enum
type RoleType = 'superAdmin' | 'admin';
// admin status enum
type StatusType = 'active' | 'inActive' | 'terminated';

export type IAdmin = {
  _id?: string;
  name: string;
  email: string;
  password: string;
  address: {
    country: string;
    town: string;
    city: string;
    hometown: string;
  };
  about: string;
  phone: string;
  designation: string;
  workAs: string;
  education: string;
  language: string;
  emailVerified: boolean;
  profileImage: string;
  role: RoleType;
  status: StatusType;
};

// admin model type
export type AdminModel = Model<IAdmin>;

// admin filterable filed
export type AdminFilters = {
  searchTerm?: string;
};

