/* eslint-disable @typescript-eslint/no-explicit-any */
import User from './user.model';
import ApiError from '../../../errors/ApiError';
import httpStatus from 'http-status';
import Cart from '../cart/cart.model';
import { CartItem, CartProduct } from '../cart/cart.interface';

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

exports.get_user_cart = async (req, res) => {
  try {
    // to get user object who added cart
    const user = await User.findOne({ email: req.user.email }).exec();
    // get cart which saves in the database
    const cart = await Cart.find({ orderedBy: user._id })
      .populate('products.product', '_id title price')
      .exec();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: 'something went wrong!' });
  }
};

exports.save_user_address = async (req, res) => {
  try {
    // save address into user
    const userAddressAdded = await User.findOneAndUpdate(
      { email: req.user.email },
      {
        address: req.body,
      },
      { new: true }
    ).exec();
    res.json(userAddressAdded);
  } catch (error) {
    res.status(500).json({ message: 'something went wrong!' });
  }
};

exports.shipping_address = async (req, res) => {
  try {
    // getting shipping address from user
    const userShippingAddress = await User.findOne({
      email: req.user.email,
    }).exec();
    res.json(userShippingAddress);
  } catch (error) {
    res.status(500).json({ message: 'something went wrong!' });
  }
};

exports.empty_cart = async (req, res) => {
  try {
    // to get user who delete the cart
    const user = await User.findOne({ email: req.user.email }).exec();
    // delete cart which delete the the database
    const deleteCart = await Cart.findOneAndDelete({
      orderedBy: user._id,
    }).exec();

    res.json({ deleteCart, ok: true });
  } catch (error) {
    res.status(500).json({ message: 'something went wrong!' });
  }
};

// getting discount price
exports.total_discount_price = async (req, res) => {
  try {
    const { couponName } = req.body;
    // checking is it valid coupon or not
    const validationCoupon = await Coupon.findOne({
      name: couponName,
    }).exec();
    if (validationCoupon === null) {
      return res.json({
        error: 'Invalid Coupon',
      });
    }

    // get user who want to process ordering
    const user = await User.findOne({ email: req.user.email }).exec();
    // getting carts by the userId
    const carts = await Cart.findOne({ orderedBy: user._id })
      .populate('products.product', '_id title price')
      .exec();
    const { cartTotal } = carts;
    // calculate totalAfterDiscount
    const totalPriceAfterDiscount =
      cartTotal - (cartTotal * validationCoupon.discount) / 100;

    await Cart.findOneAndUpdate(
      { orderedBy: user._id },
      {
        totalPriceAfterDiscount,
      },
      { new: true }
    ).exec();

    res.json({ totalPriceAfterDiscount });
  } catch (error) {
    res.status(500).json({ message: 'something went wrong!' });
  }
};

// cart order by online payment
exports.create_order = async (req, res) => {
  try {
    const { paymentIntent, paymentBy } = req.body;
    // who order
    const user = await User.findOne({ email: req.user.email }).exec();

    // which product carts
    const carts = await Cart.findOne({ orderedBy: user._id }).exec();
    const { products } = carts;

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
            _id: item.product._id,
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

    // update
    let update = await Product.bulkWrite(bulkOption, {});
    res.json({ ok: true });
  } catch (error) {
    res.status(400).send('Failed To Save Order Cart To the Database!');
  }
};

// create order by cash order delivery
exports.create_cash_orders = async (req, res) => {
  try {
    const { isCashOnDelivery, isCoupon } = req.body;

    // if isCashOnDelivery is true, it is going to process to the cash on delivery
    if (!isCashOnDelivery)
      return res.status(400).send('Create Cash Order is Failed!');
    // who payment on the cash
    const user = await User.findOne({ email: req.user.email }).exec();

    // which carts
    const userCarts = await Cart.findOne({ orderedBy: user._id }).exec();

    let finalAmount = 0;
    if (isCoupon && userCarts.totalPriceAfterDiscount) {
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
            _id: item.product._id,
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

    res.json({ ok: true, update });
  } catch (error) {
    res.status(500).json({ message: 'something went wrong!' });
  }
};

// getting all orders by user
exports.list_of_orders_by_user = async (req, res) => {
  try {
    // who is the ordered
    const user = await User.findOne({ email: req.user.email }).exec();
    // getting all orders by user id
    const allOrders = await Order.find({ orderedBy: user._id })
      .populate('products.product')
      .sort({ createdAt: -1 })
      .exec();
    res.json(allOrders);
  } catch (error) {
    res.status(500).json({ message: 'something went wrong!' });
  }
};

// add to wishlist
exports.add_to_wish_list = async (req, res) => {
  try {
    const { productId, isWishList } = req.body;
    const newWishList = await User.findOneAndUpdate(
      { email: req.user.email },
      {
        $push: {
          wishList: {
            $each: [{ product: productId, isWishList }],
          },
        },
      }
    ).exec();
    res.status(200).json(newWishList);
  } catch (error) {
    res.status(501).json({ message: 'something went wrong!' });
  }
};

// get all wishlist from user
exports.wish_lists_by_user = async (req, res) => {
  try {
    const allWishList = await User.findOne({ email: req.user.email })
      .select('wishList')
      .populate('wishList.product')
      .exec();
    res.status(200).json(allWishList);
  } catch (error) {
    res.status(501).json({ message: 'something went wrong!' });
  }
};

//get single wishlist from user wishlist
exports.get_single_wish_list = async (req, res) => {
  try {
    const { productId } = req.body;
    const allWishList = await User.findOne(
      { email: req.user.email },
      { wishList: { $elemMatch: { product: { $in: productId } } } }
    ).exec();
    res.status(200).json(allWishList);
  } catch (error) {
    res.status(501).json({ message: 'something went wrong!' });
  }
};

// remove wishlist
exports.removed_wish_list = async (req, res) => {
  try {
    const { productId } = req.body;
    const deleteWishList = await User.findOneAndUpdate(
      { email: req.user.email },
      {
        $pull: {
          wishList: { product: productId },
        },
      }
    ).exec();
    res.status(200).json(deleteWishList);
  } catch (error) {
    res.status(501).json({ message: 'something went wrong!' });
  }
};

export const UserService = {
  addUserCart,
  getSingleUser,
  updateUser,
  deleteUser,
  getUserProfile,
  updateUserProfile,
};
