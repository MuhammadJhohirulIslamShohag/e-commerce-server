import { Schema, model } from 'mongoose';
import validator from 'validator';

import { productStatus } from './product.constant';

import { IProduct, ProductModel } from './product.interface';

// product schema
const ProductSchema = new Schema<IProduct, ProductModel>(
  {
    name: {
      type: String,
      trim: true,
      unique: true,
      required: [true, 'Please provide a name!'],
      minLength: [3, 'Name must be at least 3 characters'],
      maxLength: [650, 'Name is to large!'],
    },
    slug: {
      type: String,
      trim: true,
      unique: true,
      required: [true, 'Please provide a slug!'],
      minLength: [3, 'Slug must be at least 3 characters'],
      maxLength: [650, 'Slug is to large!'],
    },
    metaTitle: {
      type: String,
      trim: true,
      minLength: [3, 'Name must be at least 3 characters'],
      maxLength: [650, 'Name is to large!'],
    },
    keyFeatures: {
      type: Schema.Types.Mixed,
    },
    description: {
      type: String,
      trim: true,
      minLength: [3, 'Description must be at least 3 characters'],
      required: [true, 'Please provide a description!'],
    },
    price: {
      type: Number,
      required: [true, 'Please provide a price!'],
    },
    quantity: {
      type: Number,
      default: 0,
    },
    sold: {
      type: Number,
      default: 0,
    },
    clickedProductCount: {
      type: Number,
      default: 0,
    },
    discount: {
      type: Number,
      default: 0,
    },
    imageURLs: [
      {
        type: String,
        required: true,
        validate: [validator.isURL, 'Please provide valid url(s)'],
      },
    ],
    isFeatured: {
      type: Boolean,
      required: [true, 'Please provide a is it featured product!'],
      default: false,
    },
    status: {
      type: String,
      enum: productStatus,
      default: 'available',
    },
    category: {
      categoryId: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
      },
      name: {
        type: String,
      },
    },
    subCategories: [
      {
        subCategoryId: {
          type: Schema.Types.ObjectId,
          ref: 'SubCategory',
        },
        name: {
          type: String,
        },
      },
    ],
    brand: {
      name: {
        type: String,
      },
      brandId: {
        type: Schema.Types.ObjectId,
        ref: 'Brand',
      },
    },
    colors: [
      {
        colorId: {
          type: Schema.Types.ObjectId,
          ref: 'Color',
        },
        name: {
          type: String,
        },
      },
    ],
    sizes: [
      {
        sizeId: {
          type: Schema.Types.ObjectId,
          ref: 'Size',
        },
        name: {
          type: String,
        },
      },
    ],
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User Id is required"],
  },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

// product model
const Product = model<IProduct, ProductModel>('Product', ProductSchema);

export default Product;
