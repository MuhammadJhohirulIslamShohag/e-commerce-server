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
} = require("../controllers/user");

// importing middleware
const { authCheck } = require("../middleware/auth");

// user routes
router.post("/user/cart", authCheck, added_user_cart);
router.get("/user/cart", authCheck, get_user_cart); // get cart
router.post("/user/address", authCheck, save_user_address); // save user address
router.get("/user/shipping-address", authCheck, shipping_address); // get user shipping address
router.delete("/user/cart", authCheck, empty_cart); // empty cart or delete cart

// cart coupon
router.post("/user/cart/coupon", authCheck, total_discount_price);

// order
router.post("/user/carts/order", authCheck, create_order); // creating order by online payment
router.post("/user/carts/order/cash", authCheck, create_cash_orders); // creating order by cash payment
router.get("/user/carts/orders", authCheck, list_of_orders_by_user);

// wishlist
router.post("/user/wishlists", authCheck, add_to_wish_list);
router.post("/user/wish-lists", authCheck, get_single_wish_list);
router.get("/user/wishlists", authCheck, wish_lists_by_user);
router.put("/user/wishlists", authCheck, removed_wish_list);

module.exports = router;
