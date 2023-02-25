const slugify = require("slugify");
const Size = require("../models/size");

exports.create_size = async (req, res) => {
    try {
        const { sizeName } = req.body;
        res.json(
            await new Size({
                name: sizeName,
                slug: slugify(sizeName),
            }).save()
        );
    } catch (error) {
        res.status(501).send("Something went wrong!");
    }
};

exports.list_of_sizes = async (req, res) => {
    try {
        const sizes = await Size.find({}).sort({ createdAt: -1 }).exec();
        res.status(200).json(sizes);
    } catch (error) {
        res.status(501).send("Something went wrong!");
    }
};

exports.get_single_size = async (req, res) => {
    try {
        const size = await Size.findOne({
            slug: req.params.slug,
        }).exec();
        res.status(200).json(size);
    } catch (error) {
        res.status(501).send("Something went wrong!");
    }
};

exports.update_size = async (req, res) => {
    try {
        const { updateSizeName } = req.body;
        const updateSize = await Size.findOneAndUpdate(
            { slug: req.params.slug },
            { name: updateSizeName, slug: slugify(updateSizeName) },
            { new: true }
        );
        res.status(200).json(updateSize);
    } catch (error) {
        res.status(501).send("Something went wrong!");
    }
};

exports.remove_size = async (req, res) => {
    try {
        const deleted_size = await Size.findOneAndDelete({
            slug: req.params.slug,
        });
        res.status(200).json(deleted_size);
    } catch (error) {
        res.status(501).send("Something went wrong!");
    }
};
