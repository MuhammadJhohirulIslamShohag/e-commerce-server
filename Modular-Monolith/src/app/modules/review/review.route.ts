import { Router } from 'express';

import { ReviewValidation } from './review.validation';
import { ReviewController } from './review.controller';

import validateRequest from '../../middlewares/validateRequest';

class ReviewRouterClass {
  readonly routers: Router;
  constructor() {
    this.routers = Router();
    this.#RouterAction();
  }

  #RouterAction() {
    // create and get all reviews routes
    this.routers
      .route('/')
      .post(
        validateRequest(ReviewValidation.reviewCreateZodSchema),
        ReviewController.createReview
      )
      .get(ReviewController.allReviews);

    // update and get single review, delete routes
    this.routers
      .route('/:id')
      .patch(
        validateRequest(ReviewValidation.reviewUpdateZodSchema),
        ReviewController.updateReview
      )
      .delete(ReviewController.deleteReview)
      .get(ReviewController.getSingleReview);
  }
}

const allRoutes = new ReviewRouterClass().routers;

export { allRoutes as ReviewRoutes };
