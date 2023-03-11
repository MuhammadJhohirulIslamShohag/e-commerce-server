const express = require("express");
const router = express.Router();

// importing middleware
const { authCheck, adminCheck } = require("../middleware/auth");

// importing controller
const {
    create_category,
    get_single_category,
    update_category,
    removed_category,
    list_of_categories,
    sub_category_based_category,
} = require("../controllers/category");

// creating category routers
router.post("/category", authCheck, adminCheck, create_category);
router.get("/categories", list_of_categories);
router.get("/categories/:slug", get_single_category);
router.put("/categories/:slug", authCheck, adminCheck, update_category);
router.delete("/categories/:slug", authCheck, adminCheck, removed_category);
router.get(
    "/categories/sub-categories/:_id",
    authCheck,
    adminCheck,
    sub_category_based_category
);

module.exports = router;
