const User = require("../models/user");
const Order = require("../models/order");

// get all users
exports.allUsers = async (req, res) => {
    try {
        const users = await User.find({ role: "user" }).exec();
        console.log(users, "users");
        res.json(users);
    } catch (error) {
        res.status(501).json({ message: "Something Went Wrong!" });
    }
};


// get all orders
exports.orders = async (req, res) => {
    const allOrders = await Order.find({})
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
