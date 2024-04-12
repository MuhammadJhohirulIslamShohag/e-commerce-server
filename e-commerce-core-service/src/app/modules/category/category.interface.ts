import { Model } from 'mongoose';
import { IFile } from '../../interfaces';

// category interface model type
export type ICategory = {
  name: string;
  imageURLs: string[];
  clickedCount: number;
};

export type ICreateCategory = {
  name: string;
  imageURLs: IFile[];
};


// category model type
export type CategoryModel = Model<ICategory>;

