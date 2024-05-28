/* eslint-disable @typescript-eslint/no-explicit-any */
import { Model, Types } from 'mongoose';

// payment status enum type
export type PaymentStatusType =
  | 'Not Processed'
  | 'Processing'
  | 'Dispatched'
  | 'Cancelled'
  | 'Completed'
  | 'Cash On Delivery';

// order status enum type
type OrderStatusType = 'ordered' | 'shipped' | 'delivered';

// payment status enum type
type PaymentByType = 'Stripe' | 'Card' | 'Cash';

export type TBillingAddress = {
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

// order interface model type
export type IOrder = {
  products: {
    productId: Types.ObjectId | string;
    count: number;
    price: number;
  };
  paymentIntents: { [key: string]: unknown };
  orderStatus: OrderStatusType;
  paymentBy: PaymentByType;
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
  billingAddress: TBillingAddress;
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

// order tracking interface type
export type ICreateOrderWithCashOnDelivery = {
  isCashOnDelivery: boolean;
  isCoupon: boolean;
  billingAddress: TBillingAddress;
};

// order model type
export type OrderModel = Model<IOrder>;

// order filterable filed
export type OrderFilters = {
  searchTerm?: string;
};
