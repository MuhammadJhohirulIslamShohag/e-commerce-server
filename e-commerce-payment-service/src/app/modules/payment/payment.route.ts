import express from 'express'
import { PaymentController } from './payment.controller'
import validateRequest from '../../middleware/validateRequest'
import { OrderValidation } from '../order/order.validation'
import { auth } from '../../middleware/auth'
import { USER_ROLE_ENUM } from '../../../enum/user'

const router = express.Router()

router
  .post(
    '/init',
    auth(USER_ROLE_ENUM.ADMIN, USER_ROLE_ENUM.SUPERADMIN, USER_ROLE_ENUM.USER),
    validateRequest(OrderValidation.orderCreateZodSchema),
    PaymentController.paymentInit
  )
  .post('/success', PaymentController.paymentSuccess)
  .post('/fail', PaymentController.paymentFail)
  .post('/cancel', PaymentController.paymentCancel)

export const PaymentRoutes = router
