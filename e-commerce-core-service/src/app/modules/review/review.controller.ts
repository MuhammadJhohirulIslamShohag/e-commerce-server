import { Request, Response } from 'express';
import httpStatus from 'http-status';

import catchAsync from '../../shared/catchAsync';
import responseReturn from '../../shared/responseReturn';

import { ReviewService } from './review.service';

class ReviewControllerClass {
  #ReviewService: typeof ReviewService;

  constructor(service: typeof ReviewService) {
    this.#ReviewService = service;
  }

  // get all reviews controller
  readonly allReviews = catchAsync(async (req: Request, res: Response) => {
    const result = await this.#ReviewService.allReviews(req.query);

    responseReturn(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'All Reviews Retrieved Successfully!',
      data: result.result,
      meta: result.meta,
    });
  });

  // get single review controller
  readonly getSingleReview = catchAsync(async (req: Request, res: Response) => {
    const reviewId = req.params.id;

    const result = await this.#ReviewService.getSingleReview(reviewId);

    responseReturn(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Single Review Retrieved Successfully!',
      data: result,
    });
  });

  // update review controller
  readonly updateReview = catchAsync(async (req: Request, res: Response) => {
    const reviewId = req.params.id;
    const { ...updateReviewData } = req.body;

    const result = await this.#ReviewService.updateReview(
      reviewId,
      updateReviewData
    );

    responseReturn(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Review Updated Successfully!',
      data: result,
    });
  });

  // delete review controller
  readonly deleteReview = catchAsync(async (req: Request, res: Response) => {
    const reviewId = req.params.id;

    const result = await this.#ReviewService.deleteReview(reviewId);

    responseReturn(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Review Removed Successfully!',
      data: result,
    });
  });
}

export const ReviewController = new ReviewControllerClass(ReviewService);
