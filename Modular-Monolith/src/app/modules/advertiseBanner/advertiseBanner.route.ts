import { Router } from 'express';
import { AdvertiseBannerController } from './advertiseBanner.controller';

import multer from 'multer';

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

class AdvertiseBannerRouterClass {
  readonly routers: Router;
  constructor() {
    this.routers = Router();
    this.#RouterAction();
  }

  #RouterAction() {
    // create and get all advertise banners routes
    this.routers
      .route('/')
      .post(
        upload.fields([{ name: 'advertiseBannerImage', maxCount: 1 }]),
        AdvertiseBannerController.createAdvertiseBanner
      )
      .get(AdvertiseBannerController.allAdvertiseBanners);

    // update and get single advertise banner, delete routes
    this.routers
      .route('/:id')
      .patch(
        upload.fields([{ name: 'advertiseBannerImage', maxCount: 1 }]),
        AdvertiseBannerController.updateAdvertiseBanner
      )
      .get(AdvertiseBannerController.getSingleAdvertiseBanner)
      .delete(AdvertiseBannerController.deleteAdvertiseBanner);
  }
}

const allRoutes = new AdvertiseBannerRouterClass().routers;

export { allRoutes as AdvertiseBannerRoutes };
