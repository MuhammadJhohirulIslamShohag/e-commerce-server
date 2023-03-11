const slugify = require("slugify");
const Category = require("../models/category");
const Product = require("../models/product");
const SubCategory = require("../models/sub-category");

exports.create_category = async (req, res) => {
    try {
        req.body.slug = slugify(req.body.name);
        res.json(await new Category(req.body).save());
    } catch (error) {
        console.log(error.message);
        res.status(400).send("Create category failed");
    }
};

exports.list_of_categories = async (req, res) => {
    const categories = await Category.find({}).sort({ createdAt: -1 }).exec();
    res.json(categories);
};
exports.get_single_category = async (req, res) => {
    const category = await Category.findOne({
        slug: req.params.slug,
    }).exec();

    const products = await Product.find({ category: category._id })
        .populate("category")
        .exec();

    res.json({ category, products });
};
exports.update_category = async (req, res) => {
    const updateCategory = await Category.findOneAndUpdate(
        { slug: req.params.slug },
        {
            name: req.body.name,
            slug: slugify(req.body.name),
            images: req.body.images,
        },
        { new: true }
    );

    res.json(updateCategory);
};
exports.removed_category = async (req, res) => {
    try {
        const deleted = await Category.findOneAndDelete({
            slug: req.params.slug,
        });
        res.json(deleted);
    } catch (error) {
        res.status(400).send("Category Delete Failed");
    }
};

exports.sub_category_based_category = (req, res) =>
    SubCategory.find({ parent: req.params._id }).exec((error, data) => {
        if (error) {
            console.log(error);
        }
        res.json(data);
    });
