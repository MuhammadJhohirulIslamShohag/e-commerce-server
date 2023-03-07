const router = require("express").Router();

// importing controller
const {
    update_order_status,
    all_orders,
    all_users,
    project_summary,
} = require("../controllers/admin");

// importing middleware
const { authCheck, adminCheck } = require("../middleware/auth");

// routes
router.get("/admin/orders", authCheck, adminCheck, all_orders);
router.get("/admin/users", authCheck, adminCheck, all_users);
router.get("/admin/product-summary", project_summary);
router.put(
    "/admin/orders/order-status",
    authCheck,
    adminCheck,
    update_order_status
);

module.exports = router;
