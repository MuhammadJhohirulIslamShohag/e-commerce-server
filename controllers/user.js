const Product = require("../models/product");
const User = require("../models/user");
const Cart = require("../models/cart");
const Coupon = require("../models/coupon");
const Order = require("../models/order");

exports.userCart = async (req, res) => {
    try {
        // receving carts data from frontend
        const { carts } = req.body;
        // finding user who save order cart into the database
        const user = await User.findOne({ email: req.user.email }).exec();

        // checking already exist cart which to save database
        const existingCartsInUser = await Cart.findOne({
            orderedBy: user._id,
        }).exec();

        // remove existing cart which already have database
        if (existingCartsInUser) {
            existingCartsInUser.deleteOne();
        }

        const products = [];
        for (let i = 0; i < carts.length; i++) {
            let object = {};
            object.product = carts[i]._id;
            object.count = carts[i].count;
            object.color = carts[i].color;
            const priceOfProduct = await Product.findById({ _id: carts[i]._id })
                .select("price")
                .exec();
            object.price = priceOfProduct.price;
            // push object products array
            products.push(object);
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
        console.log(newCart, "New Cart");
        res.json({ ok: true });
    } catch (error) {
        res.status(400).send("Failed To Save Cart To the Database!");
    }
};

exports.getUserCart = async (req, res) => {
    // to get user object who added cart
    const user = await User.findOne({ email: req.user.email }).exec();
    // get cart which saves in the database
    const cart = await Cart.find({ orderedBy: user._id })
        .populate("products.product", "_id title price")
        .exec();
    res.json(cart);
};

exports.saveAddress = async (req, res) => {
    // save address into user
    const userAddressAdded = await User.findOneAndUpdate(
        { email: req.user.email },
        {
            address: req.body,
        },
        { new: true }
    ).exec();
    res.json(userAddressAdded);
};
exports.shippingAddress = async (req, res) => {
    // getting shipping address from user
    const userShippingAddress = await User.findOne({
        email: req.user.email,
    }).exec();
    res.json(userShippingAddress);
};

exports.emptyCart = async (req, res) => {
    // to get user who delete the cart
    const user = await User.findOne({ email: req.user.email }).exec();
    // delete cart which delete the the database
    const deleteCart = await Cart.findOneAndDelete({
        orderdBy: user._id,
    }).exec();

    res.json({ deleteCart, ok: true });
};

// getting discount price
exports.totalDiscountPrice = async (req, res) => {
    const { couponName } = req.body;
    // checking is it valid coupon or not
    const validationCoupon = await Coupon.findOne({ name: couponName }).exec();
    if (validationCoupon === null) {
        return res.json({
            error: "Invalid Coupon",
        });
    }

    // get user who want to process ordering
    const user = await User.findOne({ email: req.user.email }).exec();
    // getting carts by the userId
    const carts = await Cart.findOne({ orderedBy: user._id })
        .populate("products.product", "_id title price")
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
};

// cart order
exports.createOrder = async (req, res) => {
    try {
        const { paymentIntent } = req.body.paymentIntents;
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
        }).save();

        // decrement quantity and sold increment
        const bulkOption = products.map((item) => {
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
        res.status(400).send("Failed To Save Order Cart To the Database!");
    }
};
// getting all orders by user
exports.orders = async (req, res) => {
    // who is the ordered
    const user = await User.findOne({ email: req.user.email }).exec();
    // getting all orderes by user id
    const allOrders = await Order.find({ orderedBy: user._id })
        .populate("products.product")
        .exec();
    res.json(allOrders);
};
