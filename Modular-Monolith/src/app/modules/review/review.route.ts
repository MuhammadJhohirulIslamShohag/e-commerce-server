import { Router } from 'express';

import { ReviewValidation } from './review.validation';
import { ReviewController } from './review.controller';

import validateRequest from '../../middlewares/validateRequest';
import auth from '../../middlewares/auth';
import { ENUM_USER_ROLE } from '../../enum/user';

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
        auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SELLER, ENUM_USER_ROLE.USER),
        validateRequest(ReviewValidation.reviewCreateZodSchema),
        ReviewController.createReview
      )
      .get(ReviewController.allReviews);

    // update and get single review, delete routes
    this.routers
      .route('/:id')
      .patch(
        auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SELLER, ENUM_USER_ROLE.USER),
        validateRequest(ReviewValidation.reviewUpdateZodSchema),
        ReviewController.updateReview
      )
      .delete(
        auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SELLER, ENUM_USER_ROLE.USER),
        ReviewController.deleteReview
      )
      .get(ReviewController.getSingleReview);
  }
}

const allRoutes = new ReviewRouterClass().routers;

export { allRoutes as ReviewRoutes };
