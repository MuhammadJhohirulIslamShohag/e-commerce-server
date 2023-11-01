/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import uniqid from 'uniqid';

import Cart from '../cart/cart.model';
import User from './user.model';
import { IUser } from './user.interface';
import { CartItem, CartProduct, ICart } from '../cart/cart.interface';
import ApiError from '../../../errors/ApiError';

const addUserCart = async (carts: CartItem[], email: string) => {
  // finding user who save order cart into the database
  const user = await User.findOne({ email: email }).exec();

  if (!user) {
    throw new ApiError(httpStatus.CONFLICT, 'User not found!');
  }

  // checking already exist cart which to save database
  const existingCartsInUser = await Cart.findOne({
    orderedBy: user._id as string,
  }).exec();

  // remove existing cart which already have database
  if (existingCartsInUser) {
    existingCartsInUser.deleteOne();
  }

  const products: CartProduct[] = [];
  for (let i = 0; i < carts.length; i++) {
    const priceOfProduct = await Product.findById(carts[i]._id)
      .select('price')
      .exec();

    if (!priceOfProduct) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Product not found!');
    }

    const cartProduct: CartProduct = {
      product: carts[i]._id,
      count: carts[i].count,
      color: carts[i].color,
      size: carts[i].size,
      price: priceOfProduct.price,
    };
    // push object products array
    products.push(cartProduct);
  }
  // calculate cart total
  let cartTotal = 0;
  for (let i = 0; i < carts.length; i++) {
    cartTotal += carts[i].price * carts[i].count;
  }
  // creating new cart
  const newCart = await new Cart({
    products,
    cartTotal,
    orderedBy: user._id,
  }).save();

  if (!newCart) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Cart Create Failed!');
  }

  return {
    ok: true,
  };
};

const getUserCart = async (email: string) => {
  // to get user object who added cart
  const user = await User.findOne({ email: email }).exec();

  // check user is exit, if not throw error
  if (!user) {
    throw new ApiError(httpStatus.CONFLICT, 'User not found!');
  }

  // get cart which saves in the database
  const cart = await Cart.find({ orderedBy: user._id })
    .populate('products.product', '_id title price')
    .exec();

  return cart;
};

const saveUserAddress = async (
  email: string,
  payload: Pick<IUser, 'address'>
) => {
  // to get user object who added cart
  const user = await User.findOne({ email: email }).exec();

  // check user is exit, if not throw error
  if (!user) {
    throw new ApiError(httpStatus.CONFLICT, 'User not found!');
  }

  // save address into user
  const result = await User.findOneAndUpdate(
    { email: email },
    {
      address: payload,
    },
    { new: true }
  ).exec();

  return result;
};

const shippingAddress = async (email: string) => {
  // to get user object who added cart
  const user = await User.findOne({ email: email }).exec();

  // check user is exit, if not throw error
  if (!user) {
    throw new ApiError(httpStatus.CONFLICT, 'User not found!');
  }

  // getting shipping address from user
  const result = await User.findOne({
    email: email,
  }).exec();

  return result;
};

const emptyCart = async (email: string) => {
  // to get user object who added cart
  const user = await User.findOne({ email: email }).exec();

  // check user is exit, if not throw error
  if (!user) {
    throw new ApiError(httpStatus.CONFLICT, 'User not found!');
  }
  // delete cart which delete the the database
  const result = await Cart.findOneAndDelete({
    orderedBy: user._id,
  }).exec();

  return result;
};

// getting discount price
const totalDiscountPrice = async (couponName: string, email: string) => {
  // checking is it valid coupon or not
  const coupon = await Coupon.findOne({
    name: couponName,
  }).exec();

  if (!coupon) {
    throw new ApiError(httpStatus.CONFLICT, 'Invalid Coupon Id!');
  }

  // get user who want to process ordering
  const user = await User.findOne({ email: email }).exec();

  // check user is exit, if not throw error
  if (!user) {
    throw new ApiError(httpStatus.CONFLICT, 'User not found!');
  }

  // getting carts by the userId
  const carts = await Cart.findOne({ orderedBy: user._id })
    .populate('products.product', '_id title price')
    .exec();

  const { cartTotal } = carts as ICart;

  // calculate totalAfterDiscount
  const totalPriceAfterDiscount =
    cartTotal - (cartTotal * coupon.discount) / 100;

  await Cart.findOneAndUpdate(
    { orderedBy: user._id },
    {
      totalPriceAfterDiscount,
    },
    { new: true }
  ).exec();

  return totalPriceAfterDiscount;
};

// cart order by online payment
const createOrder = async (
  paymentIntent: any,
  paymentBy: any,
  email: string
) => {
  // who order
  const user = await User.findOne({ email: email }).exec();

  // check user is exit, if not throw error
  if (!user) {
    throw new ApiError(httpStatus.CONFLICT, 'User not found!');
  }

  // which product carts
  const carts = await Cart.findOne({ orderedBy: user._id }).exec();

  // check product cart is exit, if not throw error
  if (!carts) {
    throw new ApiError(httpStatus.CONFLICT, 'Carts Not Found!');
  }

  const { products } = carts as ICart;

  // save to the database
  await new Order({
    products,
    paymentIntents: paymentIntent,
    orderedBy: user._id,
    paymentBy,
  }).save();

  // decrement quantity and sold increment
  const bulkOption = products.map(item => {
    return {
      updateOne: {
        filter: {
          _id: (item?.product as any)?._id,
        },
        update: {
          $inc: {
            quantity: -item.count,
            sold: +item.count,
          },
        },
      },
    };
  });

  await Product.bulkWrite(bulkOption, {});

  return { ok: true };
};

// create order by cash order delivery
const createCashOrders = async (
  isCashOnDelivery: boolean,
  isCoupon: boolean,
  email: string
) => {
  // if isCashOnDelivery is true, it is going to process to the cash on delivery
  if (!isCashOnDelivery) {
    throw new ApiError(httpStatus.CONFLICT, 'Create Cash Order is Failed!');
  }

  // who payment on the cash
  const user = await User.findOne({ email: email }).exec();

  // check user is exit, if not throw error
  if (!user) {
    throw new ApiError(httpStatus.CONFLICT, 'User not found!');
  }

  // which carts
  const userCarts = await Cart.findOne({ orderedBy: user._id }).exec();

  // check user cart is exit, if not throw error
  if (!userCarts) {
    throw new ApiError(httpStatus.CONFLICT, 'User Cart Not Found!');
  }

  let finalAmount = 0;

  if (isCoupon && userCarts && userCarts.totalPriceAfterDiscount) {
    finalAmount = userCarts.totalPriceAfterDiscount * 100;
  } else {
    finalAmount = userCarts.cartTotal * 100;
  }

  const update = await new Order({
    products: userCarts.products,
    paymentIntents: {
      id: uniqid(),
      amount: finalAmount,
      currency: 'usd',
      payment_method_types: ['Cash'],
      status: 'succeeded',
      created: Date.now(),
    },
    orderStatus: 'Cash On Delivery',
    orderedBy: user._id,
  }).save();

  // increment sold and decrement quantity
  const bulkWrites = userCarts.products.map(item => {
    return {
      updateOne: {
        filter: {
          _id: (item?.product as any)?._id,
        },
        update: {
          $inc: {
            quantity: -item.count,
            sold: +item.count,
          },
        },
      },
    };
  });

  await Product.bulkWrite(bulkWrites, {});

  return { ok: true, update };
};

// getting all orders by user
const listOfOrdersByUser = async (email: string) => {
  // to get user
  const user = await User.findOne({ email: email }).exec();

  // check user is exit, if not throw error
  if (!user) {
    throw new ApiError(httpStatus.CONFLICT, 'User not found!');
  }

  // getting all orders by user id
  const allOrders = await Order.find({ orderedBy: user._id })
    .populate('products.product')
    .sort({ createdAt: -1 })
    .exec();

  return allOrders;
};

// add to wish list
const addToWishList = async (
  productId: string,
  isWishList: boolean,
  email: string
) => {
  // to get user
  const user = await User.findOne({ email: email }).exec();

  // check user is exit, if not throw error
  if (!user) {
    throw new ApiError(httpStatus.CONFLICT, 'User not found!');
  }

  const result = await User.findOneAndUpdate(
    { email: email },
    {
      $push: {
        wishList: {
          $each: [{ product: productId, isWishList }],
        },
      },
    }
  ).exec();

  return result;
};

// get all wishlist from user
const wishListsByUser = async (email: string) => {
  // to get user
  const user = await User.findOne({ email: email }).exec();

  // check user is exit, if not throw error
  if (!user) {
    throw new ApiError(httpStatus.CONFLICT, 'User not found!');
  }
  const result = await User.findOne({ email: email })
    .select('wishList')
    .populate('wishList.product')
    .exec();

  return result;
};

//get single wish list from user wish list
const getSingleWishList = async (productId: string, email: string) => {
  // to get user
  const user = await User.findOne({ email: email }).exec();

  // check user is exit, if not throw error
  if (!user) {
    throw new ApiError(httpStatus.CONFLICT, 'User not found!');
  }

  const result = await User.findOne(
    { email: email },
    { wishList: { $elemMatch: { product: { $in: productId } } } }
  ).exec();

  return result;
};

// remove wish list
const removedWishList = async (productId: string, email: string) => {
  const result = await User.findOneAndUpdate(
    { email: email },
    {
      $pull: {
        wishList: { product: productId },
      },
    }
  ).exec();
  return result;
};

export const UserService = {
  addUserCart,
  getUserCart,
  saveUserAddress,
  shippingAddress,
  emptyCart,
  totalDiscountPrice,
  removedWishList,
  getSingleWishList,
  wishListsByUser,
  addToWishList,
  listOfOrdersByUser,
  createCashOrders,
  createOrder,
};
