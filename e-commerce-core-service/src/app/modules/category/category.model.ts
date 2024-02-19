import validator from 'validator'
import { Schema, model } from 'mongoose'

import { ICategory, CategoryModel } from './category.interface'

// Category schema
const categorySchema = new Schema<ICategory, CategoryModel>(
  {
    name: {
      type: String,
      trim: true,
      unique: true,
      required: [true, 'Please provide a name!'],
      minLength: [3, 'Name must be at least 3 characters'],
      maxLength: [120, 'Name is to large!'],
    },
    imageURL: {
      type: String,
      validate: [validator.isURL, 'Please provide valid category image url!'],
    },
    clickedCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
)

// Category model
const Category = model<ICategory, CategoryModel>('Category', categorySchema)

export default Category
