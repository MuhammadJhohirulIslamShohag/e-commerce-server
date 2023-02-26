const mongoose = require("mongoose");
const { Schema } = mongoose;
const { ObjectId } = mongoose.Schema;

const productSchema = new Schema(
    {
        title: {
            type: String,
            trim: true,
            required: true,
            maxLength: 32,
            text: true,
        },
        slug: {
            type: String,
            unique: true,
            lowercase: true,
            index: true,
        },
        description: {
            type: String,
            required: true,
            maxLength: 2000,
            text: true,
        },
        price: {
            type: Number,
            required: true,
            trim: true,
            maxLength: 32,
        },
        discount: {
            type: Number,
            required: true,
            trim: true,
            maxLength: 32,
        },
        category: {
            type: ObjectId,
            ref: "Category",
        },
        subCategory: [
            {
                type: ObjectId,
                ref: "SubCategory",
            },
        ],
        brand: {
            type: ObjectId,
            ref: "Brand",
        },
        colors: [
            {
                type: ObjectId,
                ref: "Color",
            },
        ],
        sizes: [
            {
                type: ObjectId,
                ref: "Size",
            },
        ],
        quantity: {
            type: Number,
        },
        sold: {
            type: Number,
            default: 0,
        },
        images: {
            type: Array,
        },
        shipping: {
            type: String,
            enum: ["Yes", "No"],
        },
        ratings: [
            {
                star: Number,
                postedBy: {
                    type: ObjectId,
                    ref: "User",
                },
            },
        ],
    },
    { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
