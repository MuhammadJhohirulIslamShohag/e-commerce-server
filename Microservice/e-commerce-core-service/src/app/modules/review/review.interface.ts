import { Model, Types } from 'mongoose';
import { IProduct } from '../product/product.interface';

// review interface model type
export type IReview = {
  productId: Types.ObjectId | IProduct;
  rating: number;
  userId: Types.ObjectId;
  comment: string;
};

// review model type
export type ReviewModel = Model<IReview>;

// review filterable filed
export type ReviewFilters = {
  searchTerm?: string;
};
