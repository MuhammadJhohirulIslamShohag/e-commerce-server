const router = require("express").Router();

// importing controller
const { orderStatus, orders } = require("../controllers/admin");

// importing middleware
const { authCheck, adminCheck } = require("../middleware/auth");

// routes
router.get("/admin/orders", authCheck, adminCheck, orders); // get all orders
router.put("/admin/orders/order-status", authCheck, adminCheck, orderStatus); //  update order status

module.exports = router;
