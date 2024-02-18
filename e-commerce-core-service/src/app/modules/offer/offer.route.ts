import express, { Router } from 'express';

import validateRequest from '../../middlewares/validateRequest';

import { OfferValidation } from './offer.validation';
import { OfferController } from './offer.controller';

const router = express.Router();

class OfferRouterClass {
  readonly routers: Router;
  constructor() {
    this.routers = Router();
    this.#RouterAction();
  }

  #RouterAction() {
    // create and get all offers routes
    router
      .route('/')
      .post(
        validateRequest(OfferValidation.offerCreateZodSchema),
        OfferController.createOffer
      )
      .get(OfferController.allOffers);

    // update and get single offer, delete routes
    router
      .route('/:id')
      .patch(
        validateRequest(OfferValidation.offerUpdateZodSchema),
        OfferController.updateOffer
      )
      .get(OfferController.getSingleOffer)
      .delete(OfferController.deleteOffer);
  }
}

const allRoutes = new OfferRouterClass().routers;

export { allRoutes as OfferRoutes };
