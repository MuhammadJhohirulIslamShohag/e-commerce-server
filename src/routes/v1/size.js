const express = require("express");
const router = express.Router();

// importing middleware
const { authCheck, adminCheck } = require("../../middleware/auth");

// importing controllers
const {
    create_size,
    list_of_sizes,
    get_single_size,
    update_size,
    remove_size,
} = require("../../controllers/size");

// creating size routers
router.route("/").post(authCheck, adminCheck, create_size).get(list_of_sizes);
router
    .route("/:slug")
    .get(get_single_size)
    .put(authCheck, adminCheck, update_size)
    .delete(authCheck, adminCheck, remove_size);

module.exports = {
    sizeRouters: router,
};
