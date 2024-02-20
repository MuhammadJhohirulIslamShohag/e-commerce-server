import httpStatus from 'http-status';

import ApiError from '../../errors/ApiError';
import QueryBuilder from '../../builder/query.builder';
import Review from './review.model';

import { IReview } from './review.interface';

class ReviewServiceClass {
  #ReviewModel;
  #QueryBuilder: typeof QueryBuilder;
  constructor() {
    this.#ReviewModel = Review;
    this.#QueryBuilder = QueryBuilder;
  }

  // get all reviews service
  readonly allReviews = async (query: Record<string, unknown>) => {
    const userQuery = new this.#QueryBuilder(this.#ReviewModel.find(), query)
      .filter()
      .sort()
      .paginate()
      .fields();

    // result of user
    const result = await userQuery.modelQuery;

    // get meta user
    const meta = await userQuery.countTotal();

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
