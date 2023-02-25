const express = require("express");
const router = express.Router();

// importing middleware
const { authCheck, adminCheck } = require("../middleware/auth");

// importing controller
const {
    create_color,
    list_of_colors,
    get_single_color,
    update_color,
    remove_color,
} = require("../controllers/color");

// creating category routers
router.post("/colors", authCheck, adminCheck, create_color);
router.get("/colors", list_of_colors);
router.get("/colors/:slug", get_single_color);
router.put("/colors/:slug", authCheck, adminCheck, update_color);
router.delete("/colors/:slug", authCheck, adminCheck, remove_color);

module.exports = router;
