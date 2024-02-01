import { Schema, model } from 'mongoose';
import validator from 'validator';

import { ISubCategory, SubCategoryModel } from './subCategory.interface';

// sub category schema
const subCategorySchema = new Schema<ISubCategory, SubCategoryModel>(
  {
    name: {
      type: String,
      trim: true,
      unique: true,
      required: [true, 'Please provide a sub category name!'],
      minLength: [3, 'Name must be at least 3 characters1'],
      maxLength: [120, 'Name is to large!'],
    },
    description: {
      type: String,
      trim: true,
      minLength: [3, 'Description must be at least 3 characters1'],
      maxLength: [520, 'Description is to large!'],
      required: [true, 'Please provide a description!'],
    },
    imageURL: {
      type: String,
      validate: [
        validator.isURL,
        'Please provide valid Sub Category image url!',
      ],
    },
    categories: [
      {
        categoryId: {
          type: Schema.Types.ObjectId,
          ref: 'Category',
        },
      },
    ],
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

// sub category model
const SubCategory = model<ISubCategory, SubCategoryModel>(
  'SubCategory',
  subCategorySchema
);

export default SubCategory;
