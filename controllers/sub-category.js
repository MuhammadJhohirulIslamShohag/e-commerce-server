const SubCategory = require("../models/subCategory");
const slugify = require("slugify");

// creating subcategory controller
exports.create = async (req, res) => {
    try {
        const { name, parent } = req.body;
        const creatingSubCategory = await new SubCategory({
            name,
            parent,
            slug: slugify(name),
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
        .sort({ createdAt: -1 })
        .exec();
    res.json(subCategories);
};

// getting single subcategory controller
exports.read = async (req, res) => {
    const singleSubCategory = await SubCategory.findOne({
        slug: req.params.slug,
    }).exec();

    res.json(singleSubCategory);
};

// update subcategory controller
exports.update = async (req, res) => {
    const { name, parent } = req.body;
    const updateSubCategory = await SubCategory.findOneAndUpdate(
        { slug: req.params.slug },
        { name, parent, slug: slugify(name) },
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


