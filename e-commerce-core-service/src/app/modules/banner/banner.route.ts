import { Router } from 'express';
import { BannerValidation } from './banner.validation';
import { BannerController } from './banner.controller';
import validateRequest from '../../middlewares/validateRequest';

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
        validateRequest(BannerValidation.bannerCreateZodSchema),
        BannerController.createBanner
      )
      .get(BannerController.allBanners);

    // update and get single banner, delete routes
    this.routers
      .route('/:id')
      .patch(
        validateRequest(BannerValidation.bannerUpdateZodSchema),
        BannerController.updateBanner
      )
      .get(BannerController.getSingleBanner)
      .delete(BannerController.deleteBanner);
  }
}

const allRoutes = new BannerRouterClass().routers;

export { allRoutes as BannerRoutes };
