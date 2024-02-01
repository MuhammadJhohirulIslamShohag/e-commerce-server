const express = require("express");
const router = express.Router();

// importing middleware
const { authCheck } = require("../../middleware/auth");

// importing controller
const { upload_image, removed_image } = require("../../controllers/cloudinary");

// Cloudinary routes
router.post("/upload-images", authCheck, upload_image);
router.post("/remove-images", authCheck, removed_image);

module.exports = {
    cloudinaryRouters: router,
};
