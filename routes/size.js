const express = require("express");
const router = express.Router();

// importing middleware
const { authCheck, adminCheck } = require("../middleware/auth");

// importing controller
const {
    create_size,
    list_of_sizes,
    get_single_size,
    update_size,
    remove_size,
} = require("../controllers/size");

// creating category routers
router.post("/sizes", authCheck, adminCheck, create_size);
router.get("/sizes", list_of_sizes);
router.get("/sizes/:slug", get_single_size);
router.put("/sizes/:slug", authCheck, adminCheck, update_size);
router.delete("/sizes/:slug", authCheck, adminCheck, remove_size);

module.exports = router;
