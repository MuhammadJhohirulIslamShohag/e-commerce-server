// importing mode and slugify
const Product = require("../models/product");
const User = require("../models/user");
const slugify = require("slugify");

exports.create = async (req, res) => {
    try {
        // saving slug because we can get slug from client
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
        const { sort, order, page } = req.query;
        let products;
        if (page === "undefined" || page === null) {
            products = await Product.find({})
                .populate("category")
                .populate("subCategory")
                .sort([[sort, order]])
                .exec();
        } else {
            const currentPage = page || 1;
            const perPage = 3; // 3
            products = await Product.find({})
                .skip((currentPage - 1) * perPage)
                .populate("category")
                .populate("subCategory")
                .sort([[sort, order]])
                .limit(perPage)
                .exec();
        }
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
            .populate("ratings.postedBy")
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

// getting related product
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

//*** getting filter product ***
// search filtering
const handleSearchFiltering = async (req, res, searchQuery) => {
    console.log("query", searchQuery);
    try {
        const products = await Product.find({
            $text: { $search: searchQuery },
        })
            .populate("category", "_id name")
            .populate("subCategory", "_id name")
            .exec();
        res.json(products);
    } catch (error) {
        console.log(error);
    }
};
// price filtering
const handlePriceFilter = async (req, res, price) => {
    try {
        const products = await Product.find({
            price: {
                $gte: price[0],
                $lte: price[1],
            },
        })
            .populate("category", "_id name")
            .populate("subCategory", "_id name")
            .exec();
        res.json(products);
    } catch (error) {
        console.log(error);
    }
};

// category filtering
const handleCategoryFilter = async (req, res, category) => {
    const products = await Product.find({ category })
        .populate("category", "_id name")
        .populate("subCategory", "_id name")
        .exec();
    console.log(products);

    res.json(products);
};

// rating filtering
const handleRatingsFiltering = (req, res, star) => {
    Product.aggregate([
        {
            $project: {
                document: "$$ROOT",
                floorAvgRatings: {
                    $avg: "$ratings.star",
                },
            },
        },
        {
            $match: { floorAvgRatings: star },
        },
    ])
        .limit(12)
        .exec((error, aggregates) => {
            if (error) console.log(error);
            Product.find({ _id: aggregates })
                .populate("category", "_id name")
                .populate("subCategory", "_id name")
                .exec((error, products) => {
                    if (error) console.log(error);
                    res.json(products);
                });
        });
};

// sub-category filtering
const handleSubCategoryFilter = async (req, res, subCategory) => {
    const products = [];
    for (let i = 0; i < subCategory.length; i++) {
        let product = await Product.find({ subCategory: subCategory[i] })
            .populate("subCategory", "_id name")
            .populate("category", "_id name")
            .exec();
        // array to object
        products.push(...product);
    }
    res.json(products);
};

// brand filtering
const handleBrandFilter = async (req, res, brand) => {
    let products = await Product.find({ brand })
        .populate("subCategory", "_id name")
        .populate("category", "_id name")
        .exec();
    res.json(products);
};

// color filtering
const handleColorFilter = async (req, res, color) => {
    let products = await Product.find({ color })
        .populate("subCategory", "_id name")
        .populate("category", "_id name")
        .exec();
    res.json(products);
};

// shipping filtering
const handleShippingFilter = async (req, res, shipping) => {
    const products = await Product.find({ shipping })
        .populate("subCategory", "_id name")
        .populate("category", "_id name")
        .exec();
    res.json(products);
};

// sorting filtering
const handleSortingFilter = async (req, res, sortingObject) => {
    const { sort, order } = sortingObject;
    const products = await Product.find({})
        .populate("category")
        .populate("subCategory")
        .sort([[sort, order]])
        .exec();

    console.log(products);
    res.json(products);
};

// mostPopular filtering
// const handleMostPopularFilter = async (req, res, mostPopular) => {
//     const { sort, order } = mostPopular;
//     const products = await Product.find({})
//         .populate("category")
//         .populate("subCategory")
//         .sort([[sort, order]])
//         .exec();
//     res.json(products);
// };
// // newest filtering
// const handleNewestFilter = async (req, res, newest) => {
//     const { sort, order } = newest;
//     const products = await Product.find({ })
//         .populate("subCategory", "_id name")
//         .populate("category", "_id name")
//         .sort([[sort, order]])
//         .exec();
//     res.json(products);
// };
// // shipping filtering
// const handleLowestToHighestFilter = async (req, res, lowestToHighest) => {
//     const { sort, order } = lowestToHighest;
//     try {
//         const products = await Product.find({})
//             .populate("category", "_id name")
//             .populate("subCategory", "_id name")
//             .sort([[sort, order]])
//             .exec();
//         res.json(products);
//     } catch (error) {
//         console.log(error);
//     }
// };

exports.productFiltering = async (req, res) => {
    const {
        searchQuery,
        price,
        category,
        shipping,
        subCategory,
        star,
        brand,
        color,
        sortingObject
    } = req.body;

    if (searchQuery) {
        await handleSearchFiltering(req, res, searchQuery);
    }
    if (price !== undefined) {
        await handlePriceFilter(req, res, price);
    }
    if (category) {
        await handleCategoryFilter(req, res, category);
    }
    if (star) {
        handleRatingsFiltering(req, res, star);
    }
    if (subCategory) {
        await handleSubCategoryFilter(req, res, subCategory);
    }
    if (brand) {
        await handleBrandFilter(req, res, brand);
    }
    if (color) {
        await handleColorFilter(req, res, color);
    }
    if (shipping) {
        await handleShippingFilter(req, res, shipping);
    }
    if (sortingObject) {
        console.log(sortingObject);
        await handleSortingFilter(req, res, sortingObject);
    }
    // if (newest) {
    //     await handleNewestFilter(req, res, newest);
    // }
    // if (lowestToHighest) {
    //     await handleLowestToHighestFilter(req, res, lowestToHighest);
    // }
    // if (highestToLowest) {
    //     await handleHighestToLowestFilter(req, res, highestToLowest);
    // }
};
