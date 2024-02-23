import { Model, Types } from 'mongoose';

// cart interface model type
export type ICart = {
  products: [
    {
      productId: Types.ObjectId | string;
      quantity: number;
    }
  ];
  cartTotal: number;
  totalPriceAfterDiscount: number;
  orderedBy: Types.ObjectId;
};

// create cart interface type
export type ICreateCart = {
  _id: Types.ObjectId | string;
  count: number;
  color: string;
  size: string;
  price: number;
};

// cart model type
export type CartModel = Model<ICart>;

// cart filterable filed
export type CartFilters = {
  searchTerm?: string;
};
