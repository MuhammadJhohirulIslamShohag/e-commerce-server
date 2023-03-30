const router = require("express").Router();

// importing controller
const {
    update_order_status,
    all_orders,
    all_users,
    project_summary,
} = require("../../controllers/admin");

// importing middleware
const { authCheck, adminCheck } = require("../../middleware/auth");

// routes
router.get("/orders", authCheck, adminCheck, all_orders);
router.get("/users", authCheck, adminCheck, all_users);
router.get("/product-summary", project_summary);
router.put(
    "/orders/order-status",
    authCheck,
    adminCheck,
    update_order_status
);

module.exports = {
    adminRouters: router,
};
