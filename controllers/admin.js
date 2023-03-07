const User = require("../models/user");
const Order = require("../models/order");
const Product = require("../models/product");

// get all users
exports.all_users = async (req, res) => {
    try {
        const users = await User.find({ role: "user" })
            .sort("-createdAt")
            .exec();
        res.json(users);
    } catch (error) {
        res.status(501).json({ message: "Something Went Wrong!" });
    }
};

// get product summary
exports.project_summary = async (req, res) => {
    try {
        const users = await User.find({}).estimatedDocumentCount().exec();
        const orders = await Order.find({}).estimatedDocumentCount().exec();
        const products = await Order.find({}).estimatedDocumentCount.exec();
        const totalEarnings = orders.reduce((acc, cur) => {
            if (cur?.amount) {
                return (acc += cur?.amount / 100);
            }
        }, 0);
        res.json({
            users,
            orders,
            products,
            totalEarnings,
        });
    } catch (error) {
        res.status(501).json({ message: "Something Went Wrong!" });
    }
};

// get all orders
exports.all_orders = async (req, res) => {
    try {
        const allOrders = await Order.find({})
            .sort("-createdAt")
            .populate("products.product")
            .populate("orderedBy")
            .exec();
        res.json(allOrders);
    } catch (error) {
        res.status(501).json({ message: "Something Went Wrong!" });
    }
};

// changing order status
exports.update_order_status = async (req, res) => {
    try {
        const { orderId, orderStatus } = req.body;

        const updateOrderStatus = await Order.findOneAndUpdate(
            { _id: orderId },
            { orderStatus },
            { new: true }
        ).exec();

        res.json(updateOrderStatus);
    } catch (error) {
        res.status(501).json({ message: "Something Went Wrong!" });
    }
};
