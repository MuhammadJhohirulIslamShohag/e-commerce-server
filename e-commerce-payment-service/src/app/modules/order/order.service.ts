/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import axios from 'axios';
import { SortOrder } from 'mongoose';

import ApiError from '../../../errors/ApiError';
import config from '../../../config';

import { IOrder, OrderFilters } from './order.interface';
import { prisma } from '../../../shared/prisma';
import { getUniqueKey } from '../../../shared/getUniqueKey';
import { Prisma } from '@prisma/client';
import { PaginationOptionType } from '../../../interfaces/pagination';
import { paginationHelper } from '../../../helpers/paginationHelper';
import { orderSearchableFields } from './order.constant';

class OrderServiceClass {
  #OrderModel;
  constructor() {
    this.#OrderModel = prisma.order;
  }

  // create order service
  readonly createOrder = async (payload: any, user: string) => {
    const { paymentIntent, paymentBy } = payload;
    // who order
    const userData = await axios.get(
      `${config.user_url_auth_service_endpoint}/${user}` ||
        'https://localhost:7000/api/vi/users'
    );

    if (!userData?.data) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User Not Found!');
    }

    // which product carts
    const carts = await axios.get(
      `${config.core_service_endpoint}/carts/${user}` ||
        'https://localhost:7000/api/vi/users'
    );

    const { products } = carts.data;

    // save to the database
    await this.#OrderModel.create({
      data: {
        products: {
          create: products.map((item: any) => ({
            name: item.product.name,
            imageURL: item.product.imageURL,
            color: item.product.color,
            size: item.product.size,
            quantity: item.product.quantity,
            discount: item.product.discount,
          })),
        },
        paymentIntents: paymentIntent,
        orderedBy: user,
        paymentBy,
        userId: user
      },
    });

    // decrement quantity and sold increment
    await axios.patch(
      `${config.core_service_endpoint}/products/update-quantity-sold`,
      {}
    );

    return { ok: true };
  };

  // create order with cash_on_delivery service
  readonly createOrderWithCashOnDelivery = async (
    payload: any,
    user: string
  ) => {
    const { isCashOnDelivery, isCoupon } = payload;

    // if isCashOnDelivery is true, it is going to process to the cash on delivery
    if (!isCashOnDelivery) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        'Create Cash Order is Failed!'
      );
    }

    // who payment on the cash
    const userData = await axios.get(
      `${config.user_url_auth_service_endpoint}/${user}` ||
        'https://localhost:7000/api/vi/users'
    );

    if (!userData?.data) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User Not Found!');
    }

    // which carts
    const carts = await axios.get(
      `${config.core_service_endpoint}/carts/${user}` ||
        'https://localhost:7000/api/vi/users'
    );

    const userCarts = carts.data;

    let finalAmount = 0;
    if (isCoupon && userCarts && userCarts?.totalPriceAfterDiscount) {
      finalAmount = userCarts?.totalPriceAfterDiscount * 100;
    } else {
      finalAmount = userCarts.cartTotal * 100;
    }

    const update = await this.#OrderModel.create({
      data: {
        products: {
          create: userCarts?.products,
        },
        paymentIntents: {
          create: {
            id: getUniqueKey('ORD'),
            amount: finalAmount,
            currency: 'usd',
            payment_method_types: ['Cash'],
            status: 'succeeded',
            created: new Date(),
          },
        },
        orderStatus: 'Cash On Delivery',
        orderedBy: user,
      },
    });

    // increment sold and decrement quantity
    const bulkWrites = userCarts?.products.map((item: any) => {
      return this.#OrderModel.update({
        where: { id: item.product.id },
        data: {
          quantity: { decrement: item.count },
          sold: { increment: item.count },
        },
      });
    });

    await prisma.$transaction(bulkWrites);

    return { ok: true, update };
  };

  // get all orders service
  readonly allOrders = async (
    paginationOption: PaginationOptionType,
    filters: OrderFilters
  ) => {
    const { searchTerm, ...filterData } = filters;
    const { page, limit, sortBy, sortOrder, skip } =
      paginationHelper.calculatePagination(paginationOption);

    // for dynamic searching
    const addCondition = [];
    if (searchTerm) {
      addCondition.push({
        OR: orderSearchableFields.map(item => ({
          [item]: {
            contains: searchTerm,
            mode: 'insensitive',
          },
        })),
      });
    }

    // for dynamic filtering
    if (Object.keys(filterData).length > 0) {
      addCondition.push({
        AND: Object.entries(filterData).map(([field, value]) => ({
          [field]: {
            equals: value,
          },
        })),
      });
    }

    const sortCondition: { [key: string]: SortOrder } = {};

    if (sortBy && sortOrder) {
      sortCondition[sortBy] = sortOrder;
    }

    const whereCondition: Prisma.OrderWhereInput = addCondition.length
      ? { AND: addCondition }
      : {};

    const result = await this.#OrderModel.findMany({
      where: whereCondition,
      orderBy: sortCondition,
      skip,
      take: limit,
    });

    const total = await this.#OrderModel.count({
      where: whereCondition,
    });

    return {
      meta: {
        page,
        total,
        limit,
      },
      data: result,
    };
  };

  // get single order service
  readonly getSingleOrder = async (payload: string) => {
    const result = await prisma.order.findUnique({
      where: { id: payload },
    });

    return result;
  };

  // update order service
  readonly updateOrder = async (id: string, payload: Partial<IOrder>) => {
    // check if Order exists, if not throw error
    const existingOrder = await this.#OrderModel.findUnique({
      where: { id },
    });

    if (!existingOrder) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Order Not Found!');
    }

    // update the order
    let result = null;
    if (Object.keys(payload).length > 0) {
      result = await this.#OrderModel.update({
        where: { id },
        data: payload,
      });
    }

    return result;
  };

  // delete order service
  readonly deleteOrder = async (payload: string) => {
    // check if order exists, if not throw error
    const existingOrder = await this.#OrderModel.findUnique({
      where: { id: payload },
    });

    if (!existingOrder) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Order Not Found!');
    }

    // delete the order
    const result = await this.#OrderModel.delete({
      where: { id: payload },
    });

    return result;
  };
}

export const OrderService = new OrderServiceClass();
