import { Schema, model } from 'mongoose';
import validator from 'validator';

import { IBlog } from './blog.interface';

const blogSchema = new Schema<IBlog>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
    },
    slug: {
      type: String,
      unique: true,
      required: [true, 'Slug is required'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    shortDescription: {
      type: String,
    },
    authorName: {
      type: String,
      required: [true, 'Author Name is required'],
    },
    imageUrl: {
      type: String,
      validate: [validator.isURL, 'Please provide valid blog image url!'],
    },
    views: { type: Number, default: 0 },
    categoryId: {
      type: String,
      required: [true, 'Category Id is required'],
    },
    tags: {
      type: [String],
      required: true,
    },
  },
  { timestamps: true },
);

export const Blog = model<IBlog>('Blog', blogSchema);
