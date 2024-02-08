/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-this-alias */
import { Schema, model } from 'mongoose'
import validator from 'validator'
import { BrandModel, IBrand } from './brand.interface'
import { brandStatus } from './brand.constant'

// brand schema
const brandSchema = new Schema<IBrand, BrandModel>(
  {
    name: {
      type: String,
      trim: true,
      unique: true,
      lowercase:true,
      required: [true, 'Please provide a name!'],
      minLength: [2, 'Name must be at least 3 characters'],
      maxLength: [120, 'Name is to large!'],
    },
    email: {
      type: String,
      unique: true,
      trim: true,
      lowercase: true,
      validate: [validator.isEmail, 'Provide a valid email!'],
      required: [true, 'Please provide a email!'],
    },
    location: {
      type: String,
    },
    website: {
      type: String,
    },
    description: {
      type: String,
      trim: true,
      minLength: [3, 'Description must be at least 3 characters'],
      maxLength: [520, 'Description is to large!'],
      required: [true, 'Please provide a description!'],
    },
    imageURL: {
      type: String,
      validate: [validator.isURL, 'Please provide valid brand image url!'],
    },
    status: {
      type: String,
      enum: brandStatus,
      default: 'inActive',
    },
    suppliers: [
      {
        supplierId: {
          type:  Schema.Types.ObjectId,
          ref: 'Supplier',
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
)

// brand model
const Brand = model<IBrand, BrandModel>('Brand', brandSchema)

export default Brand
