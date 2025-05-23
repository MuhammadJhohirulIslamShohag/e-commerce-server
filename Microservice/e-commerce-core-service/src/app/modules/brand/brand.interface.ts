import { Model } from 'mongoose';
import { IFile } from '../../interfaces';

// Brand status enum
type StatusType = 'active' | 'inActive';

// Brand interface model type
export type IBrand = {
  name: string;
  email: string;
  location: string;
  website: string;
  description: string;
  imageURL: string;
  status: StatusType;
};

// Create Brand interface model type
export type ICreateBrand = {
  name: string;
  email: string;
  location: string;
  website: string;
  description: string;
  imageURL: IFile;
  status: StatusType;
};

// Brand model type
export type BrandModel = Model<IBrand>;

// Brand filterable filed
export type BrandFilters = {
  searchTerm?: string;
};
