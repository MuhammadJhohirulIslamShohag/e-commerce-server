import { Router } from 'express';
import multer from 'multer';

import { OfferController } from './offer.controller';

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

class OfferRouterClass {
  readonly routers: Router;
  constructor() {
    this.routers = Router();
    this.#RouterAction();
  }

  #RouterAction() {
    // create and get all offers routes
    this.routers
      .route('/')
      .post(
        upload.fields([{ name: 'offerImage', maxCount: 1 }]),
        OfferController.createOffer
      )
      .get(OfferController.allOffers);

    // update and get single offer, delete routes
    this.routers
      .route('/:id')
      .patch(
        upload.fields([{ name: 'offerImage', maxCount: 1 }]),
        OfferController.updateOffer
      )
      .get(OfferController.getSingleOffer)
      .delete(OfferController.deleteOffer);
  }
}

const allRoutes = new OfferRouterClass().routers;

export { allRoutes as OfferRoutes };
