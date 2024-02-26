import { Request, Response } from 'express';

import catchAsync from '../../../shared/catchAsync';
import responseReturn from '../../../shared/responseReturn';

import { ReviewService } from './review.service';

class ReviewControllerClass {
  #ReviewService: typeof ReviewService;

  constructor(service: typeof ReviewService) {
    this.#ReviewService = service;
  }

  // create review controller
  readonly createReview = catchAsync(
    async (req: Request, res: Response) => {
      const result = await this.#ReviewService.createReview(
        req
      );

      responseReturn(res, result);
    }
  );

  // get all review controller
  readonly allReviews = catchAsync(
    async (req: Request, res: Response) => {
      const result = await this.#ReviewService.allReviews(
        req
      );

      responseReturn(res, result);
    }
  );

  // get single review user controller
  readonly getSingleReview = catchAsync(
    async (req: Request, res: Response) => {
      const result =
        await this.#ReviewService.getSingleReview(req);

      responseReturn(res, result);
    }
  );

  // update review controller
  readonly updateReview = catchAsync(
    async (req: Request, res: Response) => {
      const result = await this.#ReviewService.updateReview(
        req
      );

      responseReturn(res, result);
    }
  );

  // delete review controller
  readonly deleteReview = catchAsync(
    async (req: Request, res: Response) => {
      const result = await this.#ReviewService.deleteReview(
        req
      );

      responseReturn(res, result);
    }
  );
}

export const ReviewController = new ReviewControllerClass(
  ReviewService
);
