import { Router } from 'express';
import multer from 'multer';
import auth from '../../middlewares/auth';

import { AdvertiseBannerController } from './advertiseBanner.controller';
import { ENUM_USER_ROLE } from '../../enum/user';

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
        auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SELLER),
        upload.fields([{ name: 'advertiseBannerImage', maxCount: 1 }]),
        AdvertiseBannerController.createAdvertiseBanner
      )
      .get(AdvertiseBannerController.allAdvertiseBanners);

    // update and get single advertise banner, delete routes
    this.routers
      .route('/:id')
      .patch(
        auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SELLER),
        upload.fields([{ name: 'advertiseBannerImage', maxCount: 1 }]),
        AdvertiseBannerController.updateAdvertiseBanner
      )
      .get(AdvertiseBannerController.getSingleAdvertiseBanner)
      .delete(
        auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SELLER),
        AdvertiseBannerController.deleteAdvertiseBanner
      );
  }
}

const allRoutes = new AdvertiseBannerRouterClass().routers;

export { allRoutes as AdvertiseBannerRoutes };
