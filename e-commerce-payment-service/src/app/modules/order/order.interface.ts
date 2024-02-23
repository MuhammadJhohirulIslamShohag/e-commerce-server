/* eslint-disable @typescript-eslint/no-explicit-any */
import { Model, Types } from 'mongoose';

// payment status enum type
type PaymentStatusType =
  | 'Not Processed'
  | 'Processing'
  | 'Dispatched'
  | 'Cancelled'
  | 'Completed'
  | 'Cash On Delivery';

type BillingAddress = {
  fullName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  stateProvince: string;
  postalCode: string;
  country: string;
  phoneNumber: string;
};

// order interface model type
export type IOrder = {
  products: {
    productId: Types.ObjectId | string;
    quantity: number;
    color: string;
    size: string;
  };
  paymentIntents: any;
  orderStatus: PaymentStatusType;
  paymentBy: string;
  trackingInfo: {
    title: string;
    courier: string;
    trackingNumber: string;
  };
  orderHistory: {
    status: string;
    timestamp: string;
    isDone: boolean;
  };
  billingAddress: BillingAddress;
  orderedBy: Types.ObjectId;
};

// order tracking interface type
export type IOrderTacking = {
  trackingInfo: {
    title: string;
    courier: string;
    trackingNumber: string;
  };
  orderHistory: {
    status: string;
    isDone: boolean;
    timestamp: string;
  };
};

// order model type
export type OrderModel = Model<IOrder>;

// order filterable filed
export type OrderFilters = {
  searchTerm?: string;
};
