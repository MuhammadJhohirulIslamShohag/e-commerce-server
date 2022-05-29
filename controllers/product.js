// importing mode and slugify
const Product = require("../models/product");
const User = require("../models/user");
const slugify = require("slugify");

exports.create = async (req, res) => {
    try {
        // saving slug beacuse we can get slug from client
        req.body.slug = slugify(req.body.title);
        const newProduct = await new Product(req.body).save();
        res.json(newProduct);
    } catch (error) {
        console.log(error.message);
        // res.status(400).send("Create Product Failed");
        res.status(400).json({
            err: error.message,
        });
    }
};

// exports.list = async (req, res) => {
//     try{
//         const {sort, order, limit} = req.body
//         let products = await Product.find({})
//             .limit(limit)
//             .populate("category")
//             .populate("subs")
//             .sort([[sort, order]])
//             .exec();
//         res.json(products);
//     }catch(error){
//         res.status(400).json({
//             error:error.message
//         })
//     }
// };

// With Pagination
exports.list = async (req, res) => {
    try {
        const { sort, order, page } = req.body;
        const currentPage = page || 1;
        const perPage = 3; // 3
        const products = await Product.find({})
            .skip((currentPage - 1) * perPage)
            .populate("category")
            .populate("subCategory")
            .sort([[sort, order]])
            .limit(perPage)
            .exec();
        res.json(products);
    } catch (error) {
        res.status(400).json({
            error: error.message,
        });
    }
};

exports.totalProducts = async (req, res) => {
    let total = await Product.find({}).estimatedDocumentCount().exec();
    res.json(total);
};

exports.productsByCount = async (req, res) => {
    console.log(req.params.slug);
    console.log(req.params.count);
    try {
        let getProductsByCount = await Product.find({})
            .limit(parseInt(req.params.count))
            .populate("category")
            .populate("subCategory")
            .sort([["createdAt", "desc"]])
            .exec();
        res.json(getProductsByCount);
    } catch (error) {
        res.status(400).send("Fetching Error");
    }
};

exports.read = async (req, res) => {
    try {
        const product = await Product.findOne({
            slug: req.params.slug,
        })
            .populate("category")
            .populate("subCategory")
            .exec();
        res.json(product);
    } catch (error) {
        res.status(400).send("Server Error");
    }
};

exports.update = async (req, res) => {
    try {
        if (req.body.title) {
            req.body.slug = slugify(req.body.title);
        }
        const updated = await Product.findOneAndUpdate(
            { slug: req.params.slug },
            { ...req.body },
            { new: true }
        ).exec();
        res.json(updated);
    } catch (err) {
        res.status(400).json({
            err: err.message,
        });
    }
};

exports.remove = async (req, res) => {
    try {
        let removeProduct = await Product.findOneAndDelete({
            slug: req.params.slug,
        });
        res.json(removeProduct);
    } catch (error) {
        res.status(400).send("Product Delete Failed");
    }
};

// start rating controller
exports.productRating = async (req, res) => {
    try {
        const { star } = req.body;
        const product = await Product.findById({
            _id: req.params.productId,
        }).exec();
        const user = await User.findOne({ email: req.user.email }).exec();

        const existingRatingObject = product.ratings.find((elem) => {
            return elem.postedBy.toString() === user._id.toString();
        });
        console.log(existingRatingObject);
        if (existingRatingObject === undefined) {
            const ratingAdded = await Product.findByIdAndUpdate(
                { _id: product._id },
                {
                    $push: { ratings: { star: star, postedBy: user._id } },
                },
                { new: true }
            ).exec();
            res.json(ratingAdded);
        } else {
            // if user have already left rating, update it
            const ratingUpdated = await Product.updateOne(
                {
                    ratings: { $elemMatch: existingRatingObject },
                },
                {
                    $set: { "ratings.$.star": star },
                },
                { new: true }
            ).exec();

            res.json(ratingUpdated);
        }
    } catch (error) {
        res.send({
            err: error.message,
        });
    }
};

// geting related product
exports.relatedProduct = async (req, res) => {
    const product = await Product.findById({
        _id: req.params.productId,
    }).exec();

    const relProduct = await Product.find({
        _id: { $ne: product._id },
        category: product.category,
    });
    res.json(relProduct);
};
