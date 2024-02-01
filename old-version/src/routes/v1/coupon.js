const router = require("express").Router();

// importing middleware
const { authCheck } = require("../../middleware/auth");

// importing controller
const {
    create_coupon,
    list_of_coupon,
    remove_coupon,
} = require("../../controllers/coupon");

// routes
router
    .route("/")
    .post(authCheck, create_coupon)
    .get(authCheck, list_of_coupon);
router.delete("/:couponId", authCheck, remove_coupon);

module.exports = {
    couponRouters: router,
};
