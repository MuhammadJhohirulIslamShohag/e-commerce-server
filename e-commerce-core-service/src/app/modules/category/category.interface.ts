import { Model } from 'mongoose';

// category interface model type
export type ICategory = {
  name: string;
  description: string;
  imageURL: string;
  clickedCount: number;
};

export type CreateCategory = {
  name: string;
  description: string;
  imageURL: string;
};

// category model type
export type CategoryModel = Model<ICategory>;

