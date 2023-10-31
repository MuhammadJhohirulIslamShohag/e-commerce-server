import express from 'express';
import { OrderController } from './cart.controller';
import validateRequest from '../../middlewares/validateRequest';
import { OrderValidation } from './cart.validation';
import { ENUM_USER_ROLE } from '../../../enums/user';
import { auth } from '../../middlewares/auth';

const router = express.Router();

router
  .route('/')
  .post(
    auth(ENUM_USER_ROLE.BUYER),
    validateRequest(OrderValidation.createOrderZodSchema),
    OrderController.createOrder
  )
  .get(
    auth(ENUM_USER_ROLE.BUYER, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SELLER),
    OrderController.getAllOrders
  );

router.get(
  '/:id',
  auth(ENUM_USER_ROLE.BUYER, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SELLER),
  OrderController.getOrder
);

export const OrderRoutes = router;
