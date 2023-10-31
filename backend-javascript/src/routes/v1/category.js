const express = require("express");
const router = express.Router();

// importing middleware
const { authCheck, adminCheck } = require("../../middleware/auth");

// importing controller
const {
    create_category,
    get_single_category,
    update_category,
    removed_category,
    list_of_categories,
    sub_category_based_category,
} = require("../../controllers/category");

// creating category routers
router
    .route("/")
    .post(authCheck, adminCheck, create_category)
    .get(list_of_categories);

router
    .route("/:slug")
    .get(get_single_category)
    .put(authCheck, adminCheck, update_category)
    .delete(authCheck, adminCheck, removed_category);

router.get(
    "/sub-categories/:_id",
    authCheck,
    adminCheck,
    sub_category_based_category
);

module.exports = {
    categoryRouters: router,
};
