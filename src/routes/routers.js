const express = require("express");
const { adminRouters } = require("./v1/admin");
const { authRouters } = require("./v1/auth");
const { blogRouters } = require("./v1/blog");
const { brandRouters } = require("./v1/brand");
const { categoryRouters } = require("./v1/category");
const { cloudinaryRouters } = require("./v1/cloudinary");
const { colorRouters } = require("./v1/color");
const { couponRouters } = require("./v1/coupon");
const { productRouters } = require("./v1/product");
const { sizeRouters } = require("./v1/size");
const { stripeRouters } = require("./v1/stripe");
const { subCategoryRouters } = require("./v1/sub-category");
const { userRouters } = require("./v1/user");

const router = express.Router();

router.use("/admin", adminRouters);
router.use("/auth", authRouters);
router.use("/blogs", blogRouters);
router.use("/brands", brandRouters);
router.use("/categories", categoryRouters);
router.use("/cloudinary", cloudinaryRouters);
router.use("/colors", colorRouters);
router.use("/coupons", couponRouters);
router.use("/products", productRouters);
router.use("/sizes", sizeRouters);
router.use("/stripe", stripeRouters);
router.use("/subCategories", subCategoryRouters);
router.use("/users", userRouters);

module.exports = router;
