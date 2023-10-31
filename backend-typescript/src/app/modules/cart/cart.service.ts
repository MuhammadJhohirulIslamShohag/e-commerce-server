/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import mongoose, { Types } from 'mongoose';
import ApiError from '../../../errors/ApiError';
import Cow from '../cow/cos.model';
import { ICow } from '../cow/cow.interface';
import User from '../user/user.model';
import { IOrder } from './cart.interface';
import Order from './cart.model';
const ObjectId = mongoose.Types.ObjectId;

const createOrder = async (payload: IOrder): Promise<IOrder | null> => {
  // find the user
  const buyer = await User.findOne({ _id: payload.buyer }).lean();
  const cow = await Cow.findOne({ _id: payload.cow }).lean();

  if (!buyer) {
    throw new ApiError(httpStatus.CONFLICT, 'Invalid Buyer!');
  }

  if (!cow) {
    throw new ApiError(httpStatus.CONFLICT, 'Invalid Cow!');
  }

  if (buyer!.budget < cow!.price) {
    throw new ApiError(httpStatus.CONFLICT, 'You need more money to buy cow!');
  }

  let orderResult = null;
  // start transaction
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    // updated cow label as sold out
    const updatedSellerCowData: Partial<ICow> = {};
    updatedSellerCowData.label = 'sold out';
    await Cow.findByIdAndUpdate({ _id: payload.cow }, updatedSellerCowData);

    // deduct buyer budget and add this budget to seller income
    await User.findByIdAndUpdate(
      { _id: cow?.seller },
      {
        $inc: {
          income: cow!.price,
        },
      }
    );

    await User.findByIdAndUpdate(
      { _id: payload?.buyer },
      {
        $inc: {
          budget: -cow!.price,
        },
      }
    );

    const newOrder = await Order.create([payload], { session });
    orderResult = newOrder[0];
    await session.commitTransaction();
    await session.endSession();
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw error;
  }

  return orderResult;
};

export const getAllOrders = async (
  decodedUser: JwtPayload
): Promise<IOrder[] | null> => {
  const { userId, role } = decodedUser;

  let result = null;
  if (userId && role === 'buyer') {
    result = await Order.find({ buyer: userId })
      .populate({
        path: 'cow',
        model: 'Cow',
        populate: {
          path: 'seller',
          model: 'User',
        },
      })
      .populate('buyer');
  }

  if (userId && role === 'seller') {
    const orders = await Order.find({})
      .populate({
        path: 'cow',
        model: 'Cow',
        populate: {
          path: 'seller',
          model: 'User',
        },
      })
      .populate('buyer')
      .exec();

    const resultOrders = [];
    for (const order of orders) {
      const cow = order.cow;
      if (cow instanceof Types.ObjectId) {
        continue;
      }
      const sellerObjectId = new ObjectId(cow?.seller?._id);
      const userObjectId = new ObjectId(userId);
      if (sellerObjectId.equals(userObjectId)) {
        resultOrders.push(order);
      }
    }

    result = resultOrders;
  }

  if (userId && role === 'admin') {
    result = await Order.find({})
      .populate({
        path: 'cow',
        model: 'Cow',
        populate: {
          path: 'seller',
          model: 'User',
        },
      })
      .populate('buyer')
      .exec();
  }
  return result;
};

export const getOrder = async (
  decodedUser: JwtPayload,
  id: string
): Promise<IOrder | null> => {
  const { userId, role } = decodedUser;

  // order is exit or not, if exit, return error
  const isExitOrder = await Order.findOne({ _id: id });
  if (!isExitOrder) {
    throw new ApiError(httpStatus.CONFLICT, 'No order found!');
  }

  let result = null;
  if (userId && role === 'buyer') {
    result = await Order.findOne({ _id: id, buyer: userId })
      .populate({
        path: 'cow',
        model: 'Cow',
        populate: {
          path: 'seller',
          model: 'User',
        },
      })
      .populate('buyer')
      .exec();
  }

  if (userId && role === 'seller') {
    const orders = await Order.find({})
      .populate({
        path: 'cow',
        model: 'Cow',
        populate: {
          path: 'seller',
          model: 'User',
        },
      })
      .populate('buyer')
      .exec();

    let resultSellerOrder = null;
    for (const order of orders) {
      const cow = order.cow;
      if (cow instanceof Types.ObjectId) {
        continue;
      }

      const sellerObjectId = new ObjectId(cow?.seller?._id);
      const userObjectId = new ObjectId(userId);
      const orderObjectId = new ObjectId(order._id);
      const givenOrderObjectId = new ObjectId(id);
      if (
        sellerObjectId.equals(userObjectId) &&
        orderObjectId.equals(givenOrderObjectId)
      ) {
        resultSellerOrder = order;
        break;
      }
    }
    result = resultSellerOrder;
  }

  if (userId && role === 'admin') {
    result = await Order.findOne({ _id: id })
      .populate({
        path: 'cow',
        model: 'Cow',
        populate: {
          path: 'seller',
          model: 'User',
        },
      })
      .populate('buyer')
      .exec();
  }

  return result;
};

export const OrderService = {
  createOrder,
  getAllOrders,
  getOrder,
};
