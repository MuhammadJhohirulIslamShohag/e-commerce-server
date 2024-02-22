import httpStatus from 'http-status';
import mongoose, { SortOrder, Types } from 'mongoose';

import { orderSearchableFields, orderTrackingStatus } from './order.constant';
import {
  OrderFilters,
  IOrder,
  IOrderTacking,
  OrderCreate,
} from './order.interface';
import Order from './order.model';
import Product from '../product/product.model';
import Coupon from '../coupon/coupon.model';
import ApiError from '../../errors/ApiError';
import { GenerateNumberHelpers } from '../../helpers/generate-number.helper';
import { paginationHelper } from '../../helpers/pagination.helper';
import { PaginationOptionType } from '../../interfaces/pagination';

class OrderServiceClass {
  #OrderModel;
  #ProductModel;
  #CouponModel;
  constructor() {
    this.#OrderModel = Order;
    this.#ProductModel = Product;
    this.#CouponModel = Coupon;
  }

  // create order service
  readonly createOrder = async (
    customerId: string,
    products: {
      productId: string;
      quantity: number;
      price: number;
      originalPrice: number;
      discount: number;
    }[],
    others: Partial<IOrder>,
    totalNetAmount: number,
    transactionId: string
  ) => {
    // start transaction
    let result = null;
    const session = await mongoose.startSession();

    try {
      await session.startTransaction();

      // if product has not, throw error
      if (!products?.length) {
        throw new ApiError(httpStatus.CONFLICT, 'Product should be ordered!');
      }

      // total amount without discount
      const totalAmount = products?.reduce((acc, cur) => {
        if (cur?.originalPrice > 0) {
          acc += cur?.originalPrice;
        }
        return acc;
      }, 0);

      // *** tracking order *** //
      const modifyOrderTracking = {
        title: 'ordered',
        courier: '',
        trackingNumber: '',
      };

      // ordered history
      const modifyOrderedHistory = orderTrackingStatus.map(ots => {
        if (ots === 'ordered') {
          return {
            status: ots,
            isDone: true,
            timestamp: `${new Date()}`,
          };
        } else {
          return {
            status: ots,
            isDone: false,
            timestamp: '',
          };
        }
      });

      // make a six digit ordered id with helper function
      const orderSixDigitId =
        GenerateNumberHelpers.generateRandomSixDigitNumber();

      // if not make six digit number, throw error
      if (orderSixDigitId < 1) {
        throw new ApiError(
          httpStatus.CONFLICT,
          'Failed to Make Six Digit Order Id!'
        );
      }

      // create order
      const orderResult = await this.#OrderModel.create(
        [
          {
            products: products,
            orderId: orderSixDigitId,
            trackingInfo: modifyOrderTracking,
            orderHistory: modifyOrderedHistory,
            amount: totalAmount,
            netAmount: totalNetAmount,
            transactionId: transactionId,
            ...others,
          },
        ],
        { session }
      );

      // if has not order, throw error
      if (!orderResult?.length) {
        throw new ApiError(httpStatus.CONFLICT, 'Failed to create order!');
      }

      //*** update product and stock quantity ***//
      for (let i = 0; i < products?.length; i++) {
        const productStockQuantity = await this.#ProductModel.findOneAndUpdate(
          { _id: products?.[i]?.productId },
          {
            $inc: {
              quantity: 0 - products?.[i]?.quantity,
            },
          },
          {
            new: true,
            session,
          }
        );

        if (!productStockQuantity) {
          throw new ApiError(
            httpStatus.CONFLICT,
            'Failed to update product stock quantity!'
          );
        }
      }

      // *** billing address set to the user model *** //
      const user = await User.findOneAndUpdate(
        { _id: customerId },
        {
          $set: {
            orderAddress: others.billingAddress,
          },
        },
        { new: true, session }
      );

      // if does not has user, throw error
      if (
        !user &&
        others.billingAddress &&
        Object.keys(others.billingAddress).length < 1
      ) {
        throw new ApiError(
          httpStatus.NOT_FOUND,
          'User Not Found Or Invalid Billing Address!'
        );
      }
      await sendEmailController.sendEmailForOrderHistoryDetails;
      result = orderResult[0];

      // commit transaction
      await session.commitTransaction();
      await session.endSession();
    } catch (error) {
      await session.abortTransaction();
      await session.endSession();

      if (error instanceof ApiError) {
        throw new ApiError(httpStatus.BAD_REQUEST, error?.message);
      } else {
        throw new ApiError(
          httpStatus.INTERNAL_SERVER_ERROR,
          'Interval Server Error'
        );
      }
    }
    return result;
  };

  // create order with cash_on_delivery service
  readonly createOrderWithCashOnDelivery = async (payload: OrderCreate) => {
    if (Object.keys(payload)?.length < 1) {
      throw new ApiError(httpStatus.CONFLICT, 'Invalid Order!');
    }

    if (payload?.payment_method !== 'cash_on_delivery') {
      throw new ApiError(httpStatus.CONFLICT, 'Invalid Payment Method Status!');
    }

    // start transaction
    let result = null;
    const session = await mongoose.startSession();
    try {
      await session.startTransaction();

      const { products, ...others } = payload;

      // if product has not, throw error
      if (!products?.length) {
        throw new ApiError(httpStatus.CONFLICT, 'Product should be ordered!');
      }

      // get all of order product ids
      const productPriceModify = products?.map(product => product?.productId);

      if (productPriceModify?.length < 1) {
        throw new ApiError(httpStatus.CONFLICT, 'Invalid Product Ids!');
      }

      // get all of order products based of specific product id
      const allProducts = await this.#ProductModel.find({
        _id: {
          $in: productPriceModify,
        },
      });

      // check order product has or not
      if (allProducts?.length < 1) {
        throw new ApiError(httpStatus.CONFLICT, 'Invalid Products!');
      }

      // get product quantity based of specific id
      const productQuantity = (productId: string) => {
        const objectId = new Types.ObjectId(productId);
        return products?.find(product =>
          new Types.ObjectId(product?.productId).equals(objectId)
        )?.quantity;
      };

      // get product price calculation with discount
      const productPriceWithDiscount = (
        price: number,
        discount: number
      ): number => {
        const discountAmount = Math.ceil((discount / 100) * price);
        return price - discountAmount;
      };

      // calculate order price and added quantity
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const productPriceModifies = allProducts?.map((product:any) => ({
        productId: product?._id,
        quantity: productQuantity(product._id as string),
        price:
          productPriceWithDiscount(product?.price, product?.discount) *
          productQuantity(product._id as string),
        originalPrice: product?.price,
        discount: product?.discount,
      }));

      // total net amount with discount
      let totalNetAmount = productPriceModifies?.reduce(
        (acc: number, cur: { price: number }) => {
          if (cur?.price > 0) {
            acc += cur?.price;
          }
          return acc;
        },
        0
      );

      // check order has coupon
      if (others?.coupon) {
        // check already coupon exit, if not, throw error
        const isExitCoupon = await this.#CouponModel.findOne({
          code: others?.coupon,
        });

        // check already coupon exit, throw error
        if (!isExitCoupon) {
          throw new ApiError(httpStatus.CONFLICT, 'Coupon Not Exit!');
        }

        const couponDiscountAmount = Math.ceil(
          (isExitCoupon?.discount / 100) * totalNetAmount
        );

        totalNetAmount = totalNetAmount - couponDiscountAmount;
      }

      // if delivery charge has, add delivery charge to totalNetAmount
      if (others?.deliveryCharge) {
        totalNetAmount = totalNetAmount + Math.ceil(others?.deliveryCharge);
      }

      // total amount without discount
      const totalAmount = productPriceModifies?.reduce((acc, cur) => {
        if (cur?.originalPrice > 0) {
          acc += cur?.originalPrice;
        }
        return acc;
      }, 0);

      // *** tracking order *** //
      const modifyOrderTracking = {
        title: 'ordered',
        courier: '',
        trackingNumber: '',
      };

      // ordered history
      const modifyOrderedHistory = orderTrackingStatus.map(ots => {
        if (ots === 'ordered') {
          return {
            status: ots,
            isDone: true,
            timestamp: `${new Date()}`,
          };
        } else {
          return {
            status: ots,
            isDone: false,
            timestamp: '',
          };
        }
      });

      // make a six digit ordered id with helper function
      const orderSixDigitId =
        GenerateNumberHelpers.generateRandomSixDigitNumber();

      // if not make six digit number, throw error
      if (orderSixDigitId < 1) {
        throw new ApiError(
          httpStatus.CONFLICT,
          'Failed to Make Six Digit Order Id!'
        );
      }

      // create order
      const orderResult = await this.#OrderModel.create(
        [
          {
            products: productPriceModifies,
            orderId: orderSixDigitId,
            trackingInfo: modifyOrderTracking,
            orderHistory: modifyOrderedHistory,
            amount: totalAmount,
            netAmount: totalNetAmount,
            ...others,
          },
        ],
        { session }
      );
      if (!orderResult?.length) {
        throw new ApiError(httpStatus.CONFLICT, 'Failed to create order!');
      }

      // *** billing address set to the user model *** //
      const user = await User.findOneAndUpdate(
        { _id: others?.customer?.customerId },
        {
          $set: {
            orderAddress: others.billingAddress,
          },
        },
        { new: true, session }
      );

      // if does not has user, throw error
      if (
        !user &&
        others.billingAddress &&
        Object.keys(others.billingAddress).length < 1
      ) {
        throw new ApiError(
          httpStatus.NOT_FOUND,
          'User Not Found Or Invalid Billing Address!'
        );
      }
      await sendEmailController.sendEmailForOrderHistoryDetails;
      result = orderResult[0];

      // commit transaction
      await session.commitTransaction();
      await session.endSession();
    } catch (error) {
      await session.abortTransaction();
      await session.endSession();

      if (error instanceof ApiError) {
        throw new ApiError(httpStatus.BAD_REQUEST, error?.message);
      } else {
        throw new ApiError(
          httpStatus.INTERNAL_SERVER_ERROR,
          'Interval Server Error'
        );
      }
    }

    return result;
  };

  // get all orders service
  readonly allOrders = async (
    paginationOption: PaginationOptionType,
    filters: OrderFilters
  ) => {
    const { page, limit, sortBy, sortOrder, skip } =
      paginationHelper.calculatePagination(paginationOption);

    // exact search term
    const { searchTerm, ...filterData } = filters;

    const andConditions = [];

    // searching specific filed with dynamic way
    if (searchTerm) {
      andConditions.push({
        $or: orderSearchableFields.map(field => ({
          [field]: {
            $regex: searchTerm,
            $options: 'i',
          },
        })),
      });
    }

    // exact filtering with dynamic way
    if (Object.keys(filterData).length) {
      andConditions.push({
        $and: Object.entries(filterData).map(([field, value]) => ({
          [field]: value,
        })),
      });
    }

    // dynamic sorting
    const sortConditions: { [key: string]: SortOrder } = {};

    if (sortBy && sortOrder) sortConditions[sortBy] = sortOrder;

    const whereConditions =
      andConditions.length > 0 ? { $and: andConditions } : {};

    // result of order
    const result = await this.#OrderModel
      .find(whereConditions)
      .populate('products.productId')
      .populate('customer.customerId')
      .sort(sortConditions)
      .skip(skip)
      .limit(limit);

    // get total order
    const total = await this.#OrderModel.countDocuments(whereConditions);

    return {
      meta: {
        page,
        limit,
        total,
      },
      data: result,
    };
  };

  // get single order service
  readonly getSingleOrder = async (payload: string): Promise<IOrder | null> => {
    const result = await this.#OrderModel
      .findById(payload)
      .populate('products.productId')
      .populate('customer.customerId')
      .exec();
    return result;
  };

  // update order service
  readonly updateOrder = async (
    id: string,
    payload: Partial<IOrder>
  ): Promise<IOrder | null> => {
    // check already Order exit, if not throw error
    const isExitOrder = await this.#OrderModel.findById({ _id: id });
    if (!isExitOrder) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Order Not Found!');
    }

    const { ...updatedOrderData }: Partial<IOrder> = payload;

    // update the order
    let result = null;

    if (Object.keys(updatedOrderData).length) {
      result = await this.#OrderModel.findOneAndUpdate(
        { _id: id },
        { ...updatedOrderData },
        {
          new: true,
        }
      );
    }

    return result;
  };

  // order tracking status
  readonly updateOrderStatusTracking = async (
    id: string,
    payload: IOrderTacking
  ): Promise<{
    updateResult: IOrder | null;
    totalDeliveryTime: number;
  }> => {
    // check already Order exit, if not throw error
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const isExitOrder: any = await this.#OrderModel.findById({ _id: id });
    if (!isExitOrder) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Order Not Found!');
    }

    const { trackingInfo } = payload;

    const updateOrderTracking: Partial<IOrderTacking> = {};

    // update tracking info
    if (trackingInfo && Object.keys(trackingInfo)?.length > 0) {
      Object.keys(trackingInfo).map(key => {
        const trackingInfoKey =
          `trackingInfo.${key}` as keyof Partial<IOrderTacking>;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (updateOrderTracking as any)[trackingInfoKey] =
          trackingInfo[key as keyof typeof trackingInfo];
      });
    }

    // check user delivered before shipped, if it is, throw error
    if (
      payload?.orderHistory?.status === 'delivered' &&
      !isExitOrder?.orderHistory?.[1]?.isDone
    ) {
      throw new ApiError(
        httpStatus.NOT_FOUND,
        'Without Shipped, we can not move to be delivered!'
      );
    }

    // update order history
    const orderHistory = isExitOrder?.orderHistory?.map(
      (oh: { status: string; timestamp: string; isDone: boolean }) => {
        if (oh?.status === payload?.orderHistory?.status) {
          return {
            status: payload?.orderHistory?.status,
            timestamp: `${new Date()}`,
            isDone: true,
          };
        } else {
          return {
            status: oh?.status,
            timestamp: oh?.timestamp,
            isDone: oh?.isDone,
          };
        }
      }
    );

    const result = {
      totalDeliveryTime: 0,
      updateResult: null,
    };

    // update the order
    result.updateResult = await this.#OrderModel.findOneAndUpdate(
      { _id: id },
      {
        $set: {
          orderHistory: orderHistory,
          ...updateOrderTracking,
        },
      },
      {
        new: true,
      }
    );

    // send email to customer with email template and total delivered time
    if (
      payload?.orderHistory?.status === 'delivered' &&
      isExitOrder?.orderHistory?.[2]?.isDone
    ) {
      await sendEmailController.sendEmailForOrderHistoryDetails;

      // get orderedTimestamp and delivered Timestamp
      const orderedTimestamp = isExitOrder?.orderHistory?.find(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (history: any) => history.status === 'ordered'
      )?.timestamp;
      const deliveredTimestamp = isExitOrder?.orderHistory?.find(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (history: any) => history.status === 'delivered'
      )?.timestamp;

      const orderHours = new Date(orderedTimestamp).getHours();
      const deliveredHours = new Date(deliveredTimestamp).getHours();

      if (deliveredHours && orderHours) {
        result.totalDeliveryTime = deliveredHours - orderHours;
      }
    }

    return result;
  };

  // delete order service
  readonly deleteOrder = async (payload: string): Promise<IOrder | null> => {
    // check already order exit, if not throw error
    const isExitOrder = await this.#OrderModel.findById({ _id: payload });
    if (!isExitOrder) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Order Not Found!');
    }

    // delete the order
    const result = await this.#OrderModel.findByIdAndDelete(payload);
    return result;
  };
}

export const OrderService = new OrderServiceClass();
