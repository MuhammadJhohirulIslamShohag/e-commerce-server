const SubCategory = require("../models/sub-category");
const Product = require("../models/product");
const slugify = require("slugify");

// creating subcategory controller
exports.create = async (req, res) => {
    try {
        const { subCategoryName, parent } = req.body;
        const creatingSubCategory = await new SubCategory({
            name: subCategoryName,
            parent,
            slug: slugify(subCategoryName),
        }).save();
        res.json(creatingSubCategory);
    } catch (error) {
        console.log(error);
        res.status(400).send("Create sub category failed");
    }
};

// getting all subcategory controller
exports.list = async (req, res) => {
    const subCategories = await SubCategory.find({})
        .populate("parent")
        .sort({ createdAt: -1 })
        .exec();
    res.json(subCategories);
};

// getting single subcategory controller
exports.read = async (req, res) => {
    const subCategory = await SubCategory.findOne({
        slug: req.params.slug,
    }).exec();
    const subCategoryProduct = await Product.find({
        subCategory: subCategory._id,
    })
        .populate("category")
        .populate("subCategory")
        .exec();
    res.json({
        subCategory,
        subCategoryProduct,
    });
};

// update subcategory controller
exports.update = async (req, res) => {
    const { updateSubCategoryName, parent } = req.body;
    const updateSubCategory = await SubCategory.findOneAndUpdate(
        { slug: req.params.slug },
        {
            name: updateSubCategoryName,
            parent,
            slug: slugify(updateSubCategoryName),
        },
        { new: true }
    );
    res.json(updateSubCategory);
};

// removing subcategory controller
exports.remove = async (req, res) => {
    try {
        const deletedSubCategory = await SubCategory.findOneAndDelete({
            slug: req.params.slug,
        });
        res.json(deletedSubCategory);
    } catch (error) {
        res.status(400).send("Deleted Sub Category Failed");
    }
};
