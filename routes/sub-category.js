const express = require("express");
const router = express.Router();

// importing middleware
const { authCheck, adminCheck } = require("../middleware/auth");

// importing controller
const {
    create,
    list,
    read,
    update,
    remove,
    getSubCategory
} = require("../controllers/sub-category");

// sub-category routing
router.post("/sub-category", authCheck, adminCheck, create);
router.get("/sub-categories", list);
router.get("/sub-categories/:slug", read);
router.put("/sub-categories/:slug", authCheck, adminCheck, update);
router.delete("/sub-categories/:slug", authCheck, adminCheck, remove);


module.exports = router;
