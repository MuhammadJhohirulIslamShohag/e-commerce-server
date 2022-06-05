const route = require("express").Router();

// importing midleware
const { authCheck, adminCheck } = require("../middleware/auth");

// importing controller
const { create, list, remove} = require("../controllers/coupon");

// routes
route.post("/coupon", authCheck, adminCheck, create); // creating coupon
route.get("/coupons", authCheck, adminCheck, list); // getting all coupon
route.delete("/coupons/:couponId", authCheck, adminCheck, remove); // delete single coupon

module.exports = route;
