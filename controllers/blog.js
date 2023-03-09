const Blog = require("../models/blog");

exports.create_blog = async (req, res) => {
    try {
        const blog = await new Blog(req.body).save();
        res.json(blog);
    } catch (error) {
        res.status(501).send("Something went wrong!");
    }
};

exports.list_of_blogs = async (req, res) => {
    try {
        const blogs = await Blog.find({}).sort({ createdAt: -1 }).exec();
        res.status(200).json(blogs);
    } catch (error) {
        res.status(501).send("Something went wrong!");
    }
};
