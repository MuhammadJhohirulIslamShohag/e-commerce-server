const User = require("../models/user");
const Order = require("../models/order");

// get all orders
exports.orders = async (req, res) => {
    const allOrders = await Order.find({ })
        .sort("-createdAt")
        .populate("products.product")
        .exec();
    res.json(allOrders);
};

// changing order status
exports.orderStatus = async (req, res) => {
    const { orderId, orderStatus } = req.body;

    const updateOrderStatus = await Order.findOneAndUpdate(
        { _id: orderId },
        { orderStatus },
        { new: true }
    ).exec();

    res.json(updateOrderStatus);
};
