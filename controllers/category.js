//importing slugify
const slugify = require("slugify");

// importing model
const Category = require("../models/category");
const Product = require("../models/product");
const SubCategory = require("../models/sub-category");

exports.create = async (req, res) => {
    console.log(req.body.categoryName);
    try {
        const { categoryName } = req.body;
        res.json(
            await new Category({
                name: categoryName,
                slug: slugify(categoryName),
            }).save()
        );
    } catch (error) {
        console.log(error.message);
        res.status(400).send("Create category failed");
    }
};

exports.list = async (req, res) => {
    const categories = await Category.find({}).sort({ createdAt: -1 }).exec();
    res.json(categories);
};
exports.read = async (req, res) => {
    const category = await Category.findOne({
        slug: req.params.slug,
    }).exec();

    const products = await Product.find({ category: category._id })
        .populate("category")
        .exec();

    res.json({ category, products });
};
exports.update = async (req, res) => {
    const { updateCategoryName } = req.body;
    console.log(updateCategoryName);
    const updateCategory = await Category.findOneAndUpdate(
        { slug: req.params.slug },
        { name: updateCategoryName, slug: slugify(updateCategoryName) },
        { new: true }
    );

    res.json(updateCategory);
};
exports.remove = async (req, res) => {
    try {
        const deleted = await Category.findOneAndDelete({
            slug: req.params.slug,
        });
        res.json(deleted);
    } catch (error) {
        res.status(400).send("Category Delete Failed");
    }
};

// getting sub category according to id
exports.subCategoryOnCategory = (req, res) =>
    SubCategory.find({ parent: req.params._id }).exec((error, data) => {
        if (error) {
            console.log(error);
        }
        res.json(data);
    });
