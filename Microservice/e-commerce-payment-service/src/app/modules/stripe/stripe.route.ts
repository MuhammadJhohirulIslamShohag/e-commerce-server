import { Router } from 'express';

import validateRequest from '../../middlewares/validateRequest';

import { StripeValidation } from './stripe.validation';
import { StripeController } from './stripe.controller';

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
      validateRequest(StripeValidation.intentsCreateStripeZodSchema),
      StripeController.intentsCreateStripe
    );
  }
}

const allRoutes = new StripeRouterClass().routers;

export { allRoutes as StripeRoutes };
