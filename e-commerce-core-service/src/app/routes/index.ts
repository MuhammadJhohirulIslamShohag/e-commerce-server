import express, { Router } from 'express';
import { CategoryRoutes } from '../modules/category/category.route';
import { SubCategoryRoutes } from '../modules/subCategory/subCategory.route';
import { SizeRoutes } from '../modules/size/size.route';
import { CouponRoutes } from '../modules/coupon/coupon.route';
import { BrandRoutes } from '../modules/brand/brand.route';
import { ColorRoutes } from '../modules/color/color.route';
import { OfferRoutes } from '../modules/offer/offer.route';
import { BannerRoutes } from '../modules/banner/banner.route';

const router: Router = express.Router();

const moduleRoutes = [
  {
    path: '/categories',
    route: CategoryRoutes,
  },
  {
    path: '/sub-categories',
    route: SubCategoryRoutes,
  },
  {
    path: '/coupons',
    route: CouponRoutes,
  },
  {
    path: '/sizes',
    route: SizeRoutes,
  },
  {
    path: '/brands',
    route: BrandRoutes,
  },
  {
    path: '/colors',
    route: ColorRoutes,
  },
  {
    path: '/offers',
    route: OfferRoutes,
  },
  {
    path: '/banners',
    route: BannerRoutes,
  },
];

moduleRoutes.forEach(mr => router.use(mr.path, mr.route));

export default router;
