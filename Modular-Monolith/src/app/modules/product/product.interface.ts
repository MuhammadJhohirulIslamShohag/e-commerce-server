/* eslint-disable @typescript-eslint/no-explicit-any */
import { Model, Types } from 'mongoose';

import { IBrand } from '../brand/brand.interface';
import { IColor } from '../color/color.interface';
import { ISize } from '../size/size.interface';
import { ICategory } from '../category/category.interface';
import { ISubCategory } from '../subCategory/subCategory.interface';
import { IFile } from '../../interfaces';

// product status
type ProductStatus = 'available' | 'discontinue' | 'upcoming';

// product interface model type
export type IProduct = {
  slug: string;
  name: string;
  metaTitle: string;
  description: string;
  price: number;
  discount: number;
  clickedProductCount: number;
  quantity: number;
  sold: number;
  imageURLs: string[];
  isFeatured: boolean;
  status: ProductStatus;
  category: {
    name: string;
    categoryId: Types.ObjectId | ICategory;
  };
  keyFeatures: any;
  subCategories: [
    {
      name: string;
      subCategoryId: Types.ObjectId | ISubCategory;
    }
  ];
  brand: {
    name: string;
    brandId: Types.ObjectId | IBrand;
  };
  colors: [
    {
      name: string;
      colorId: Types.ObjectId | IColor;
    }
  ];
  sizes: [
    {
      name: string;
      sizeId: Types.ObjectId | ISize;
    }
  ];
  userId: Types.ObjectId;
};

// create product interface type
export type ICreateProduct = {
  name: string;
  metaTitle: string;
  description: string;
  price: number;
  discount: number;
  quantity: number;
  imageURLs: [IFile];
  isFeatured: boolean;
  category: {
    name: string;
    categoryId: Types.ObjectId | ICategory;
  };
  subCategories: [
    {
      name: string;
      id?: string;
      subCategoryId: Types.ObjectId | ISubCategory;
    }
  ];
  brand: {
    name: string;
    brandId: Types.ObjectId | IBrand;
  };
  colors: {
    name: string;
    colorId: Types.ObjectId | IColor;
  }[];
  sizes: {
    name: string;
    sizeId: Types.ObjectId | ISize;
  }[];
  userId: Types.ObjectId;
};

// product model
export type ProductModel = Model<IProduct>;

// product filterable filed
export type ProductFilters = {
  searchTerm?: string;
  isFeatured?: boolean;
  userId?: Types.ObjectId;
  minPrice?: string;
  maxPrice?: string;
  rating?: string;
  [key: string]: unknown;
};

// product review data
export type ProductReviewDataType = {
  rating: string;
  userId: string;
  comment: string;
};

// product sub category data
export type ProductSubCategoryDataType = {
  name: string;
  description: string;
  imageURL: string;
};
