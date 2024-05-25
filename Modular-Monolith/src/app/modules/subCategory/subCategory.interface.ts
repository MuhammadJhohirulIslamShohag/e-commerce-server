import { Model, Types } from 'mongoose';
import { IFile } from '../../interfaces';

// sub category interface model type
export type ISubCategory = {
  name: string;
  imageURL: string;
  categoryId: Types.ObjectId;
};

// create sub category interface model type
export type ICreateSubCategory = {
  name: string;
  imageURL: IFile;
  categoryId: Types.ObjectId;
};

// sub category model type
export type SubCategoryModel = Model<ISubCategory>;
