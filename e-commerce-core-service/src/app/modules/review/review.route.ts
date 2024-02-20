import { Router } from 'express';

import { ReviewValidation } from './review.validation';
import { ReviewController } from './review.controller';

import validateRequest from '../../middlewares/validateRequest';

class BannerRouterClass {
  readonly routers: Router;
  constructor() {
    this.routers = Router();
    this.#RouterAction();
  }

  #RouterAction() {
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

const allRoutes = new BannerRouterClass().routers;

export { allRoutes as ReviewRoutes };
