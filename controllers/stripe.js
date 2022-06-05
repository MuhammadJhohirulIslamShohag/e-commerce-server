const Cart = require("../models/cart");
const User = require("../models/user");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

exports.createPaymentIntent = async (req, res) => {
    const { isCouponed } = req.body;
    // getting who payment or order
    const user = await User.findOne({ email: req.user.email }).exec();

    // getting total price before discount
    const cart = await Cart.findOne({ orderedBy: user._id }).exec();
    const { cartTotal, totalPriceAfterDiscount } = cart;

    // checking order amount based on couponed
    let orderAmount = 0;
    if (isCouponed && totalPriceAfterDiscount !== null) {
        orderAmount = totalPriceAfterDiscount * 100;
    } else {
        orderAmount = cartTotal * 100;
    }

    // create a payment intent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
        amount: orderAmount,
        currency: "usd",
        automatic_payment_methods: {
            enabled: true,
        },
    });

    res.json({
        clientSecret: paymentIntent.client_secret,
        cartTotal, 
        totalPriceAfterDiscount,
        payable: orderAmount
    });
};
