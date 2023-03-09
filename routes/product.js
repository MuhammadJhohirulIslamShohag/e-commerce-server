const express = require("express");

const router = express.Router();

// importing middleware
const { authCheck, adminCheck } = require("../middleware/auth");

// importing controller
const {
    create_new_product,
    get_products_with_sorting,
    products_by_count,
    get_single_product,
    update_product,
    removed_product,
    get_total_products,
    added_product_rating,
    get_related_product,
    productFiltering,
} = require("../controllers/product");

router.post("/product", authCheck, adminCheck, create_new_product);
router.get("/products", get_products_with_sorting);
router.post("/products/total", get_total_products);
router.get("/products/:slug", get_single_product);
router.get("/products/count/:count", products_by_count);
router.put("/products/:slug", authCheck, adminCheck, update_product);
router.delete("/products/:slug", authCheck, adminCheck, removed_product);

// rating
router.post("/products/ratings/:productId", authCheck, added_product_rating);
// related product
router.get("/products/related/:productId", get_related_product);
// filtering
router.post("/products/filter", productFiltering);

module.exports = router;
