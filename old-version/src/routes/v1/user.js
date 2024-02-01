const router = require("express").Router();

// importing controller
const {
    added_user_cart,
    get_user_cart,
    empty_cart,
    save_user_address,
    shipping_address,
    total_discount_price,
    create_order,
    create_cash_orders,
    list_of_orders_by_user,
    add_to_wish_list,
    get_single_wish_list,
    wish_lists_by_user,
    removed_wish_list,
} = require("../../controllers/user");

// importing middleware
const { authCheck } = require("../../middleware/auth");

// user routes
router
    .route("/cart")
    .post(authCheck, added_user_cart)
    .get(authCheck, get_user_cart)
    .delete(authCheck, empty_cart);

router.post("/address", authCheck, save_user_address);
router.get("/shipping-address", authCheck, shipping_address); // get user

// cart coupon
router.post("/cart/coupon", authCheck, total_discount_price);

// order
router.post("/carts/order", authCheck, create_order); // creating order by online payment
router.post("/carts/order/cash", authCheck, create_cash_orders); // creating order by cash payment
router.get("/carts/orders", authCheck, list_of_orders_by_user);

// wishlist
router
    .route("/wishlists")
    .post(authCheck, add_to_wish_list)
    .get(authCheck, wish_lists_by_user)
    .put(authCheck, removed_wish_list);
router.post("/wish-lists", authCheck, get_single_wish_list);

module.exports = {
    userRouters: router,
};
