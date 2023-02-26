const express = require("express");
const router = express.Router();

// importing middleware
const { authCheck, adminCheck } = require("../middleware/auth");

// importing controller
const {
    create_brand,
    list_of_brands,
    get_single_brand,
    update_brand,
    remove_brand,
} = require("../controllers/brand");

// creating brand routers
router.post("/brands", authCheck, adminCheck, create_brand);
router.get("/brands", list_of_brands);
router.get("/brands/:slug", get_single_brand);
router.put("/brands/:slug", authCheck, adminCheck, update_brand);
router.delete("/brands/:slug", authCheck, adminCheck, remove_brand);

module.exports = router;
