const express = require("express");
const router = express.Router();

// importing middleware
const { authCheck, adminCheck } = require("../../middleware/auth");

// importing controller
const {
    create_brand,
    list_of_brands,
    get_single_brand,
    update_brand,
    remove_brand,
} = require("../../controllers/brand");

// creating brand routers
router.route("/").get(list_of_brands).post(authCheck, adminCheck, create_brand);
router
    .route("/:slug")
    .get(get_single_brand)
    .put(authCheck, adminCheck, update_brand)
    .delete(authCheck, adminCheck, remove_brand);

module.exports = {
    brandRouters: router,
};
