import { Router } from 'express';

import validateRequest from '../../middlewares/validateRequest';
import auth from '../../middlewares/auth';

import { StripeValidation } from './stripe.validation';
import { StripeController } from './stripe.controller';
import { ENUM_USER_ROLE } from '../../enum/user';

class StripeRouterClass {
  readonly routers: Router;
  constructor() {
    this.routers = Router();
    this.#RouterAction();
  }

  #RouterAction() {
    // intents create routes
    this.routers.post(
      '/create-payment-intent',
      auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER),
      validateRequest(StripeValidation.intentsCreateStripeZodSchema),
      StripeController.intentsCreateStripe
    );
  }
}

const allRoutes = new StripeRouterClass().routers;

export { allRoutes as StripeRoutes };
