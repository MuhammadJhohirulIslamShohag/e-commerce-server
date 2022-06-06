const router = require("express").Router();

// importing controller
const {
    userCart,
    getUserCart,
    emptyCart,
    saveAddress,
    shippingAddress,
    totalDiscountPrice,
    createOrder,
    orders
} = require("../controllers/user");

// importing middleware
const { authCheck } = require("../middleware/auth");

// routes
router.post("/user/cart", authCheck, userCart); // save order or cart
router.get("/user/cart", authCheck, getUserCart); // get cart
router.post("/user/address", authCheck, saveAddress); // save user address
router.get("/user/shipping-address", authCheck, shippingAddress); // get user shipping address
router.delete("/user/cart", authCheck, emptyCart); // empty cart or delete cart

// cart coupon
router.post("/user/cart/coupon", authCheck, totalDiscountPrice);

// order
router.post("/user/carts/order", authCheck, createOrder);
router.get("/user/carts/orders", authCheck, orders)

module.exports = router;
