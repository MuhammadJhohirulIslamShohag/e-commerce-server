import { Request } from 'express';

import { CoreService } from '../../../shared/axios';
import { IGenericResponse } from '../../../interfaces/common';

class OrderServiceClass {
  #CoreService;
  constructor() {
    this.#CoreService = CoreService;
  }

  // create order service
  readonly createOrder = async (req: Request) => {
    const response: IGenericResponse = await this.#CoreService.post(
      `orders`,
      req.body,
      {
        headers: {
          Authorization: req.headers.authorization,
        },
      }
    );
    return response;
  };

  // total discount price service
  readonly totalDiscountPrice = async (req: Request) => {
    const response: IGenericResponse = await this.#CoreService.patch(
      `orders/total-discount-price`,
      req.body,
      {
        headers: {
          Authorization: req.headers.authorization,
        },
      }
    );
    return response;
  };

  // create order with cash_on_delivery service
  readonly createOrderWithCashOnDelivery = async (req: Request) => {
    const response: IGenericResponse = await this.#CoreService.post(
      `orders/order-cash-on-delivery`,
      req.body,
      {
        headers: {
          Authorization: req.headers.authorization,
        },
      }
    );
    return response;
  };

  // get all orders service
  readonly allOrders = async (req: Request) => {
    const response: IGenericResponse = await CoreService.get(`orders`, {
      params: req.query,
      headers: {
        Authorization: req.headers.authorization,
      },
    });
    return response;
  };

  // get single order service
  readonly getSingleOrder = async (req: Request) => {
    const { id } = req.params;

    const response: IGenericResponse = await CoreService.get(`orders/${id}`, {
      headers: {
        Authorization: req.headers.authorization,
      },
    });
    return response;
  };

  // update order service
  readonly updateOrder = async (req: Request) => {
    const { id } = req.params;

    const response: IGenericResponse = await CoreService.patch(
      `orders/${id}`,
      req.body,
      {
        headers: {
          Authorization: req.headers.authorization,
        },
      }
    );
    return response;
  };

  // update order tracking status service
  readonly updateOrderStatusTracking = async (req: Request) => {
    const { id } = req.params;

    const response: IGenericResponse = await CoreService.patch(
      `orders/order-tracking-status/${id}`,
      req.body,
      {
        headers: {
          Authorization: req.headers.authorization,
        },
      }
    );
    return response;
  };

  // delete order service
  readonly deleteOrder = async (req: Request) => {
    const { id } = req.params;

    const response: IGenericResponse = await CoreService.delete(
      `orders/${id}`,
      {
        headers: {
          Authorization: req.headers.authorization,
        },
      }
    );
    return response;
  };
}

export const OrderService = new OrderServiceClass();
