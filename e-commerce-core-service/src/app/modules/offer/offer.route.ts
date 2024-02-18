import express from 'express'
import validateRequest from '../../middleware/validateRequest'
import { OfferValidation } from './offer.validation'
import { OfferController } from './offer.controller'
import { auth } from '../../middleware/auth'
import { USER_ROLE_ENUM } from '../../../enum/user'

const router = express.Router()

// create and get all Offers routes
router
  .route('/')
  .post(
    auth(USER_ROLE_ENUM.ADMIN, USER_ROLE_ENUM.SUPERADMIN),
    validateRequest(OfferValidation.offerCreateZodSchema),
    OfferController.createOffer
  )
  .get(OfferController.allOffers)

// update and get single Offer, delete routes
router
  .route('/:id')
  .patch(
    auth(USER_ROLE_ENUM.ADMIN, USER_ROLE_ENUM.SUPERADMIN),
    validateRequest(OfferValidation.offerUpdateZodSchema),
    OfferController.updateOffer
  )
  .get(OfferController.getSingleOffer)
  .delete(
    auth(USER_ROLE_ENUM.ADMIN, USER_ROLE_ENUM.SUPERADMIN),
    OfferController.deleteOffer
  )

export const OfferRoutes = router
