const slugify = require("slugify");
const Color = require("../models/color");

exports.create_color = async (req, res) => {
    try {
        const { colorName } = req.body;
        res.json(
            await new Color({
                name: colorName,
                slug: slugify(colorName),
            }).save()
        );
    } catch (error) {
        res.status(501).send("Something went wrong!");
    }
};

exports.list_of_colors = async (req, res) => {
    try {
        const colors = await Color.find({}).sort({ createdAt: -1 }).exec();
        res.status(200).json(colors);
    } catch (error) {
        res.status(501).send("Something went wrong!");
    }
};

exports.get_single_color = async (req, res) => {
    try {
        const color = await Color.findOne({
            slug: req.params.slug,
        }).exec();
        res.status(200).json(color);
    } catch (error) {
        res.status(501).send("Something went wrong!");
    }
};

exports.update_color = async (req, res) => {
    try {
        const { updateColorName } = req.body;
        const updateColor = await Color.findOneAndUpdate(
            { slug: req.params.slug },
            { name: updateColorName, slug: slugify(updateColorName) },
            { new: true }
        );
        res.status(200).json(updateColor);
    } catch (error) {
        res.status(501).send("Something went wrong!");
    }
};

exports.remove_color = async (req, res) => {
    console.log(req.params.slug)
    try {
        const deleted_color = await Color.findOneAndDelete({
            slug: req.params.slug,
        });
        res.status(200).json(deleted_color);
    } catch (error) {
        res.status(501).send("Something went wrong!");
    }
};
