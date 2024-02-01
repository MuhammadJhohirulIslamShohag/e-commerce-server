const express = require("express");
const router = express.Router();

// importing controller
const { create_blog, list_of_blogs } = require("../../controllers/blog");

// creating blog router
router.route("/").get(list_of_blogs).post(create_blog);

module.exports = {
    blogRouters: router,
};
