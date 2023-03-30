const express = require("express");
const router = express.Router();

// importing middleware
const { authCheck, adminCheck } = require("../../middleware/auth");

// importing controller
const {
    create_color,
    list_of_colors,
    get_single_color,
    update_color,
    remove_color,
} = require("../../controllers/color");

// creating color routers
router.route("/").post(authCheck, adminCheck, create_color).get(list_of_colors);

router
    .route("/:slug")
    .get(get_single_color)
    .put(authCheck, adminCheck, update_color)
    .delete(authCheck, adminCheck, remove_color);

module.exports = {
    colorRouters: router,
};
