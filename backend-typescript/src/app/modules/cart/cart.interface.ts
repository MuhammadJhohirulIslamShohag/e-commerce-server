import { Model, Types } from 'mongoose';

export type CartItem = {
  _id: string;
  color: string;
  count: number;
  size: string;
  price: number;
};

export type CartProduct = {
  product: string;
  count: number;
  color: string;
  size: string;
  price: number;
};

export type ICart = {
  products: [
    {
      product: {
        type: Types.ObjectId;
        ref: 'Product';
      };
      count: number;
      color: string;
      price: number;
    }
  ];
  cartTotal: number;
  totalPriceAfterDiscount: number;
  CartedBy: {
    type: Types.ObjectId;
    ref: 'User';
  };
};

export type CartModel = Model<ICart, Record<string, unknown>>;
