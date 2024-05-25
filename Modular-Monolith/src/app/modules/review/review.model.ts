import { Schema, model } from 'mongoose';
import { ReviewModel, IReview } from './review.interface';

// review schema
const reviewSchema = new Schema<IReview, ReviewModel>(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, 'Please provide a product id!'],
    },
    rating: {
      type: Number,
      trim: true,
      min: 0,
      max: 5,
      required: [true, 'Please provide a rating!'],
    },
    comment: {
      type: String,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Please provide a user id'],
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

// review model
const Review = model<IReview, ReviewModel>('Review', reviewSchema);

export default Review;
