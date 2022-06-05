const router = require("express").Router();

// importing middleware
const { authCheck } = require("../middleware/auth");

// importing controller
const { createPaymentIntent } = require("../controllers/stripe");

// routes
router.post("/create-payment-intent", authCheck, createPaymentIntent);

module.exports = router;
