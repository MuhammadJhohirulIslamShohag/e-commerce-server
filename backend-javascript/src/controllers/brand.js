const slugify = require("slugify");
const Brand = require("../models/brand");

exports.create_brand = async (req, res) => {
    try {
        const { brandName } = req.body;
        res.json(
            await new Brand({
                name: brandName,
                slug: slugify(brandName),
            }).save()
        );
    } catch (error) {
        res.status(501).send("Something went wrong!");
    }
};

exports.list_of_brands = async (req, res) => {
    try {
        const brands = await Brand.find({}).sort({ createdAt: -1 }).exec();
        res.status(200).json(brands);
    } catch (error) {
        res.status(501).send("Something went wrong!");
    }
};

exports.get_single_brand = async (req, res) => {
    try {
        const brand = await Brand.findOne({
            slug: req.params.slug,
        }).exec();
        res.status(200).json(brand);
    } catch (error) {
        res.status(501).send("Something went wrong!");
    }
};

exports.update_brand = async (req, res) => {
    try {
        const { updateBrandName } = req.body;
        const updateBrand = await Brand.findOneAndUpdate(
            { slug: req.params.slug },
            { name: updateBrandName, slug: slugify(updateBrandName) },
            { new: true }
        );
        res.status(200).json(updateBrand);
    } catch (error) {
        res.status(501).send("Something went wrong!");
    }
};

exports.remove_brand = async (req, res) => {
    console.log(req.params.slug)
    try {
        const deleted_brand = await Brand.findOneAndDelete({
            slug: req.params.slug,
        });
        res.status(200).json(deleted_brand);
    } catch (error) {
        res.status(501).send("Something went wrong!");
    }
};
