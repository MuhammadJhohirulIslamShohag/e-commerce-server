//importing slugify
const slugify = require("slugify");

// importing model
const Category = require("../models/category");
const SubCategory = require('../models/sub-category')


exports.create = async (req, res) => {
    console.log(req.body.name);
    try {
        const { name } = req.body;
        res.json(
            await new Category({
                name,
                slug: slugify(name),
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
    const singleCategory = await Category.findOne({
        slug: req.params.slug,
    }).exec();

    res.json(singleCategory);
};
exports.update = async (req, res) => {
    const { name } = req.body;
    const updateCategory = await Category.findOneAndUpdate(
        { slug: req.params.slug },
        { name, slug: slugify(name) },
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
exports.subCategoryOnCategory = (req, res) =>(
    SubCategory.find({parent:req.params._id}).exec((error, data)=>{
        if(error){
            console.log(error);
        }
        res.json(data);
    })
);


