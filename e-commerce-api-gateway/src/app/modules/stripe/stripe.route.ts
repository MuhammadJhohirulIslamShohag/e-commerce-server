import { Router } from 'express';

import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';

import { StripeController } from './stripe.controller';
import { StripeValidation } from './stripe.validation';
import { ENUM_USER_ROLE } from '../../../enum/user';

class StripeRouterClass {
  readonly routers: Router;
  constructor() {
    this.routers = Router();
    this.#RouterAction();
  }

  #RouterAction() {
    // create routes
    this.routers
      .route('/create-payment-intent')
      .post(
        auth(ENUM_USER_ROLE.ADMIN),
        validateRequest(StripeValidation.intentsCreateStripeZodSchema),
        StripeController.createStripe
      );
  }
}

const allRoutes = new StripeRouterClass().routers;

export { allRoutes as StripeRoutes };
