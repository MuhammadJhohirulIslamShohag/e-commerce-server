const express = require("express");
const router = express.Router();

// importing middleware
const { authCheck, adminCheck } = require("../middleware/auth");

// importing controller
const {
    create_sub_category,
    list_of_sub_categories,
    get_single_sub_category,
    update_sub_category,
    removed_sub_category,
} = require("../controllers/sub-category");

// sub-category routes
router.post("/sub-category", authCheck, adminCheck, create_sub_category);
router.get("/sub-categories", list_of_sub_categories);
router.get("/sub-categories/:slug", get_single_sub_category);
router.put("/sub-categories/:slug", authCheck, adminCheck, update_sub_category);
router.delete(
    "/sub-categories/:slug",
    authCheck,
    adminCheck,
    removed_sub_category
);

module.exports = router;
