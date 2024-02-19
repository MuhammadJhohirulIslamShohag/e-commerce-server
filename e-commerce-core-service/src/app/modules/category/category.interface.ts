import { Model } from 'mongoose';
import { IFile } from '../../interfaces';

// category interface model type
export type ICategory = {
  name: string;
  imageURL: string;
  clickedCount: number;
};

export type ICreateCategory = {
  name: string;
  imageURL: IFile;
};

// category model type
export type CategoryModel = Model<ICategory>;

