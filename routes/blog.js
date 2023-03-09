const express = require("express");
const router = express.Router();

// importing controller
const { create_blog, list_of_blogs } = require("../controllers/blog");

// creating blog router
router.post("/blogs", create_blog);
router.get("/blogs", list_of_blogs);

module.exports = router;
