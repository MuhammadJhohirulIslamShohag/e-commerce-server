import express from 'express'
import validateRequest from '../../middleware/validateRequest'
import { BannerValidation } from './banner.validation'
import { BannerController } from './banner.controller'
import { auth } from '../../middleware/auth'
import { USER_ROLE_ENUM } from '../../../enum/user'

const router = express.Router()

// create and get all banners routes
router
  .route('/')
  .post(
    auth(USER_ROLE_ENUM.ADMIN, USER_ROLE_ENUM.SUPERADMIN),
    validateRequest(BannerValidation.bannerCreateZodSchema),
    BannerController.createBanner
  )
  .get(BannerController.allBanners)

// update and get single banner, delete routes
router
  .route('/:id')
  .patch(
    auth(USER_ROLE_ENUM.ADMIN, USER_ROLE_ENUM.SUPERADMIN),
    validateRequest(BannerValidation.bannerUpdateZodSchema),
    BannerController.updateBanner
  )
  .get(BannerController.getSingleBanner)
  .delete(
    auth(USER_ROLE_ENUM.ADMIN, USER_ROLE_ENUM.SUPERADMIN),
    BannerController.deleteBanner
  )

export const BannerRoutes = router
