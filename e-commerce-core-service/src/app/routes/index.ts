import express, { Router } from 'express';
import { CategoryRoutes } from '../modules/category/category.route';
import { SubCategoryRoutes } from '../modules/subCategory/subCategory.route';
import { SizeRoutes } from '../modules/size/size.route';
import { CouponRoutes } from '../modules/coupon/coupon.route';
import { BrandRoutes } from '../modules/brand/brand.route';
import { ColorRoutes } from '../modules/color/color.route';
import { AdvertiseBannerRoutes } from '../modules/advertiseBanner/advertiseBanner.route';
import { ProductRoutes } from '../modules/product/product.route';
import { OrderRoutes } from '../modules/order/order.route';

const router: Router = express.Router();

const moduleRoutes = [
  {
    path: '/categories',
    route: CategoryRoutes,
  },
  {
    path: '/products',
    route: ProductRoutes,
  },
  {
    path: '/orders',
    route: OrderRoutes,
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
    path: '/advertise-banners',
    route: AdvertiseBannerRoutes,
  },
];

moduleRoutes.forEach(mr => router.use(mr.path, mr.route));

export default router;
