const express = require("express");

const router = express.Router();

// importing middleware
const { authCheck, adminCheck } = require("../middleware/auth");

// importing controller
const {
    create,
    list,
    productsByCount,
    read,
    update,
    remove,
    totalProducts,
    productRating,
} = require("../controllers/product");

router.post("/product", authCheck, adminCheck, create);
router.post("/products/total", totalProducts);
router.get("/products/:count", productsByCount);
router.get("/products/:slug", read);
router.put("/products/:slug", authCheck, adminCheck, update);
router.delete("/products/:slug", authCheck, adminCheck, remove);
router.post("/products", list);

// rating
router.put("/products/ratings/:productId", authCheck, productRating);

module.exports = router;
