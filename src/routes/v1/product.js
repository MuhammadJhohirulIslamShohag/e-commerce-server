const express = require("express");

const router = express.Router();

// importing middleware
const { authCheck, adminCheck } = require("../../middleware/auth");

// importing controllers
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
} = require("../../controllers/product");

// creating products routers
router
    .route("/")
    .post(authCheck, adminCheck, create_new_product)
    .get(get_products_with_sorting);
router.post("/total", get_total_products);

router
    .route("/:slug")
    .get(get_single_product)
    .put(authCheck, adminCheck, update_product)
    .delete(authCheck, adminCheck, removed_product);
router.get("/count/:count", products_by_count);

// rating
router.post("/ratings/:productId", authCheck, added_product_rating);
// related product
router.get("/related/:productId", get_related_product);
// filtering
router.post("/filter", productFiltering);

module.exports = {
    productRouters: router,
};
