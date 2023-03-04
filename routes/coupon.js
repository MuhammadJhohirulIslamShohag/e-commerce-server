const route = require("express").Router();

// importing middleware
const { authCheck, adminCheck } = require("../middleware/auth");

// importing controller
const {
    create_coupon,
    list_of_coupon,
    remove_coupon,
} = require("../controllers/coupon");

// routes
route.post("/coupon", authCheck, adminCheck, create_coupon);
route.get("/coupons", authCheck, adminCheck, list_of_coupon);
route.delete("/coupons/:couponId", authCheck, adminCheck, remove_coupon);

module.exports = route;
