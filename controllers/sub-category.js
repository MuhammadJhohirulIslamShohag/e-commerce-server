const SubCategory = require("../models/sub-category");
const Product = require("../models/product");
const slugify = require("slugify");

// creating subcategory controller
exports.create_sub_category = async (req, res) => {
    try {
        req.body.slug = slugify(req.body.name);
        const creatingSubCategory = await new SubCategory(req.body).save();
        res.json(creatingSubCategory);
    } catch (error) {
        console.log(error);
        res.status(400).send("Create sub category failed");
    }
};

// getting all subcategory controller
exports.list_of_sub_categories = async (req, res) => {
    const subCategories = await SubCategory.find({})
        .populate("parent")
        .sort({ createdAt: -1 })
        .exec();
    res.json(subCategories);
};

// getting single subcategory controller
exports.get_single_sub_category = async (req, res) => {
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
exports.update_sub_category = async (req, res) => {
    const updateSubCategory = await SubCategory.findOneAndUpdate(
        { slug: req.params.slug },
        {
            name: req.body.name,
            parent: req.body.parent,
            slug: slugify(req.body.name),
            images: req.body.images,
        },
        { new: true }
    );
    res.json(updateSubCategory);
};

// removing subcategory controller
exports.removed_sub_category = async (req, res) => {
    try {
        const deletedSubCategory = await SubCategory.findOneAndDelete({
            slug: req.params.slug,
        });
        res.json(deletedSubCategory);
    } catch (error) {
        res.status(400).send("Deleted Sub Category Failed");
    }
};
