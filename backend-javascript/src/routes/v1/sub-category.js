const express = require("express");
const router = express.Router();

// importing middleware
const { authCheck, adminCheck } = require("../../middleware/auth");

// importing controllers
const {
    create_sub_category,
    list_of_sub_categories,
    get_single_sub_category,
    update_sub_category,
    removed_sub_category,
} = require("../../controllers/sub-category");

// sub-category routes
router
    .route("/")
    .post(authCheck, adminCheck, create_sub_category)
    .get(list_of_sub_categories);
router
    .route("/:slug")
    .get(get_single_sub_category)
    .put(authCheck, adminCheck, update_sub_category)
    .delete(authCheck, adminCheck, removed_sub_category);

module.exports = {
    subCategoryRouters: router,
};
