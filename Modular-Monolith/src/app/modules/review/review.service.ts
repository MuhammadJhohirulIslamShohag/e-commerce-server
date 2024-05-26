import httpStatus from 'http-status';

import ApiError from '../../errors/ApiError';
import QueryBuilder from '../../builder/query.builder';
import Review from './review.model';
import Product from '../product/product.model';

import { IReview } from './review.interface';

class ReviewServiceClass {
  #ReviewModel;
  #ProductModel;
  #QueryBuilder: typeof QueryBuilder;
  
  constructor() {
    this.#ReviewModel = Review;
    this.#ProductModel = Product;
    this.#QueryBuilder = QueryBuilder;
  }

  // create review service
  readonly createReview = async (payload: IReview) => {

    const isExitProduct = await this.#ProductModel.findOne({
      _id: payload.productId,
    });

    // check product is not exit
    if (!isExitProduct) {
      throw new ApiError(httpStatus.CONFLICT, 'Product Not Exit!');
    }

    const isExitReview = await this.#ReviewModel.findOne({
      userId: payload.userId,
      productId: payload.productId,
    });

    // check review is exit
    if (isExitReview) {
      throw new ApiError(httpStatus.CONFLICT, 'Review already Exit!');
    }

    // save review
    const result = await this.#ReviewModel.create(payload);

    if (!result || result === null) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        'Something went wrong while saving comment save, please try again with correct data!'
      );
    }

    // remove index
    this.#ReviewModel.collection.dropIndexes();

    return result;
  };

  // get all reviews service
  readonly allReviews = async (query: Record<string, unknown>) => {
    const reviewQuery = new this.#QueryBuilder(this.#ReviewModel.find(), query)
      .filter()
      .sort()
      .paginate()
      .fields();

    // result of review
    const result = await reviewQuery.modelQuery;

    // get meta review
    const meta = await reviewQuery.countTotal();

    return {
      meta,
      result,
    };
  };

  // get single review service
  readonly getSingleReview = async (payload: string) => {
    const result = await this.#ReviewModel.findById(payload).exec();
    return result;
  };

  // update review service
  readonly updateReview = async (id: string, payload: Partial<IReview>) => {
    // check already review exit, if not throw error
    const isExitReview = await this.#ReviewModel.findOne({
      $and: [
        { _id: id },
        { productId: payload?.productId },
        { userId: payload?.userId },
      ],
    });
    if (!isExitReview) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Review Not Found!');
    }

    // update review from review
    const result = await this.#ReviewModel.findOneAndUpdate(
      { _id: id },
      {
        $set: {
          comment: payload?.comment,
          rating: payload?.rating || isExitReview?.rating,
        },
      },
      {
        new: true,
      }
    );

    return result;
  };

  // delete review service
  readonly deleteReview = async (reviewId: string) => {
    // check already review exit, if not throw error
    const isExitReview = await this.#ReviewModel.findById({ _id: reviewId });
    if (!isExitReview) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Review Not Found!');
    }

    // delete review
    const review = await this.#ReviewModel.findByIdAndDelete({
      _id: reviewId,
    });

    return review;
  };
}

export const ReviewService = new ReviewServiceClass();
