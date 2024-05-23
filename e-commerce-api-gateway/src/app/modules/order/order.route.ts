import { Router } from 'express';

import { ENUM_USER_ROLE } from '../../../enum/user';
import { OrderValidation } from './order.validation';
import { OrderController } from './order.controller';

import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';

class OrderRouterClass {
  readonly routers: Router;
  constructor() {
    this.routers = Router();
    this.#RouterAction();
  }

  #RouterAction() {
    // update order tracking status routes
    this.routers.patch(
      '/order-tracking-status/:id',
      validateRequest(OrderValidation.orderTrackingStatusUpdateZodSchema),
      OrderController.updateOrderStatusTracking
    );

    // total discount price routes
    this.routers.patch(
      '/total-discount-price',
      auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER),
      OrderController.totalDiscountPrice
    );

    // create order with cash-on-delivery routes
    this.routers
      .route('/order-cash-on-delivery')
      .post(
        validateRequest(OrderValidation.orderCreateZodSchema),
        auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER),
        OrderController.createOrderWithCashOnDelivery
      );

    // create and get all orders routes
    this.routers
      .route('/')
      .post(
        auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER),
        OrderController.createOrder
      )
      .get(
        auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER),
        OrderController.allOrders
      );

    // get single order, delete routes
    this.routers
      .route('/:id')
      .get(
        auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER),
        OrderController.getSingleOrder
      )
      .patch(
        auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER),
        validateRequest(OrderValidation.orderUpdateZodSchema),
        OrderController.updateOrder
      )
      .patch(
        auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER),
        validateRequest(OrderValidation.orderTrackingStatusUpdateZodSchema),
        OrderController.updateOrderStatusTracking
      )
      .delete(
        auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER),
        OrderController.deleteOrder
      );
  }
}

const allRoutes = new OrderRouterClass().routers;

export { allRoutes as OrderRoutes };
