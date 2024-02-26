import { Router } from 'express';

import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';

import { ReviewController } from './review.controller';
import { ENUM_USER_ROLE } from '../../../enum/user';
import { ReviewValidation } from './review.validation';

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
        auth(ENUM_USER_ROLE.ADMIN),
        validateRequest(ReviewValidation.reviewCreateZodSchema),
        ReviewController.createReview
      )
      .get(ReviewController.allReviews);

    // update and get single review, delete routes
    this.routers
      .route('/:id')
      .patch(
        auth(ENUM_USER_ROLE.ADMIN),
        validateRequest(ReviewValidation.reviewUpdateZodSchema),
        ReviewController.updateReview
      )
      .get(ReviewController.getSingleReview)
      .delete(auth(ENUM_USER_ROLE.ADMIN), ReviewController.deleteReview);
  }
}

const allRoutes = new ReviewRouterClass().routers;

export { allRoutes as ReviewRoutes };
