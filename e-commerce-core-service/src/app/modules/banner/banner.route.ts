import { Router } from 'express';
import multer from 'multer';

import { BannerController } from './banner.controller';

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

class BannerRouterClass {
  readonly routers: Router;
  constructor() {
    this.routers = Router();
    this.#RouterAction();
  }

  #RouterAction() {
    // create and get all banners routes
    this.routers
      .route('/')
      .post(
        upload.fields([{ name: 'bannerImage', maxCount: 1 }]),
        BannerController.createBanner
      )
      .get(BannerController.allBanners);

    // update and get single banner, delete routes
    this.routers
      .route('/:id')
      .patch(
        upload.fields([{ name: 'bannerImage', maxCount: 1 }]),
        BannerController.updateBanner
      )
      .get(BannerController.getSingleBanner)
      .delete(BannerController.deleteBanner);
  }
}

const allRoutes = new BannerRouterClass().routers;

export { allRoutes as BannerRoutes };
