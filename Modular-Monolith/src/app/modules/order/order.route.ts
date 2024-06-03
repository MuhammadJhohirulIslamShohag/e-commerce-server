import { Router } from 'express';

import { OrderValidation } from './order.validation';
import { OrderController } from './order.controller';
import { ENUM_USER_ROLE } from '../../enum/user';

import validateRequest from '../../middlewares/validateRequest';
import auth from '../../middlewares/auth';

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
      auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SELLER),
      validateRequest(OrderValidation.orderTrackingStatusUpdateZodSchema),
      OrderController.updateOrderStatusTracking
    );

    // total discount price routes
    this.routers.patch(
      '/total-discount-price',
      auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER, ENUM_USER_ROLE.SELLER),
      OrderController.totalDiscountPrice
    );

    // create order with cash-on-delivery routes
    this.routers
      .route('/order-cash-on-delivery')
      .post(
        auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER, ENUM_USER_ROLE.SELLER),
        validateRequest(OrderValidation.orderCashOnDeliveryZodSchema),
        OrderController.createOrderWithCashOnDelivery
      );

    // create and get all orders routes
    this.routers
      .route('/')
      .post(
        auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER, ENUM_USER_ROLE.SELLER),
        OrderController.createOrder
      )
      .get(
        auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER, ENUM_USER_ROLE.SELLER),
        OrderController.allOrders
      );

    // get single order, delete routes
    this.routers
      .route('/:id')
      .get(
        auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER, ENUM_USER_ROLE.SELLER),
        OrderController.getSingleOrder
      )
      .patch(
        auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER, ENUM_USER_ROLE.SELLER),
        validateRequest(OrderValidation.orderUpdateZodSchema),
        OrderController.updateOrder
      )
      .patch(
        auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER, ENUM_USER_ROLE.SELLER),
        validateRequest(OrderValidation.orderTrackingStatusUpdateZodSchema),
        OrderController.updateOrderStatusTracking
      )
      .delete(
        auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER, ENUM_USER_ROLE.SELLER),
        OrderController.deleteOrder
      );
  }
}

const allRoutes = new OrderRouterClass().routers;

export { allRoutes as OrderRoutes };
