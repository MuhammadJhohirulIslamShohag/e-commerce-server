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
    createCashOrders,
    orders,
    addToWhisList,
    whisLists,
    whisList,
    removeWhisList
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
router.post("/user/carts/order", authCheck, createOrder); // creating order by online payment
router.post("/user/carts/order/cash", authCheck, createCashOrders);// creating order by cash payment
router.get("/user/carts/orders", authCheck, orders);

// whislist
router.post("/user/whislist", authCheck, addToWhisList);
router.post("/user/whis-list", authCheck, whisList);
router.get("/user/whislists", authCheck, whisLists);
router.put("/user/whislist", authCheck, removeWhisList);

module.exports = router;
