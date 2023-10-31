import { Request, RequestHandler, Response } from 'express';
import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import ApiError from '../../../errors/ApiError';
import catchAsync from '../../../shared/catchAsync';
import responseReturn from '../../../shared/responseReturn';
import { IOrder } from './cart.interface';
import { OrderService } from './cart.service';

const createOrder: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { ...orderData } = req.body;

    const result = await OrderService.createOrder(orderData);

    if (!result) {
      throw new ApiError(400, 'Failed to Create Order!');
    }
    responseReturn<IOrder>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Order created successfully!',
      data: result,
    });
  }
);

const getAllOrders: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { ...decodedUser } = req.user as JwtPayload;

    const result = await OrderService.getAllOrders(decodedUser);

    responseReturn<IOrder[]>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Orders retrieved successfully!',
      data: result,
    });
  }
);

const getOrder: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { ...decodedUser } = req.user as JwtPayload;
    const id = req.params.id;
    const result = await OrderService.getOrder(decodedUser, id);

    responseReturn<IOrder | null>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Order retrieved successfully!',
      data: result,
    });
  }
);

export const OrderController = {
  createOrder,
  getAllOrders,
  getOrder,
};
