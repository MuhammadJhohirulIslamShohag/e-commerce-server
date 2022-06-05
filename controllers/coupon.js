const Coupon = require("../models/coupon");

// creating coupon
exports.create = async (req, res) => {
    try {
        const { couponName, discount, expireDate } = req.body;
        const createCoupon = await new Coupon({
            name: couponName,
            discount,
            expiry: expireDate,
        }).save();
        res.json(createCoupon);
    } catch (error) {
        console.log(error);
        res.status(400).send("Creating Coupon Filed!");
    }
};

// list of coupon
exports.list = async (req, res) => {
    try {
        const listOfCoupons = await Coupon.find({}).exec();
        res.json(listOfCoupons);
    } catch (error) {
        console.log(error);
        res.status(400).send("Showing List Of Coupon Filed!");
    }
};

// removing single coupon by couponId
exports.remove = async (req, res) => {
    try {
        const deleteCoupon = await Coupon.findOneAndDelete({
            _id: req.params.couponId,
        }).exec();
        res.json(deleteCoupon);
    } catch (error) {
        console.log(error);
        res.status(400).send("Removing Coupon Filed!");
    }
};
