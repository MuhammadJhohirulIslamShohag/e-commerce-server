const router = require("express").Router();

// importing middleware
const { authCheck } = require("../middleware/auth");

// importing controller
const { create_payment_intent } = require("../controllers/stripe");

// routes
router.post("/create-payment-intent", authCheck, create_payment_intent);

module.exports = router;
