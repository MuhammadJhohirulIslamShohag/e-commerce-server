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
    relatedProduct
} = require("../controllers/product");

router.post("/product", authCheck, adminCheck, create);
router.post("/products/total", totalProducts);
router.post("/products", list);
router.get("/products/:slug", read);
router.get("/products/count/:count", productsByCount);
router.put("/products/:slug", authCheck, adminCheck, update);
router.delete("/products/:slug", authCheck, adminCheck, remove);

// rating
router.post("/products/ratings/:productId", authCheck, productRating);
// related product
router.get("/products/related/:productId", relatedProduct);


module.exports = router;
