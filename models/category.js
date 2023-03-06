const mongoose = require("mongoose");
const { Schema } = mongoose;

// creating category schema
const categorySchema = new Schema(
    {
        name: {
            type: String,
            trim: true,
            required: "Name is required",
            minLength: [2, "Too short"],
            maxLength: [32, "Too long"],
        },
        slug: {
            type: String,
            unique: true,
            lowercase: true,
            index: true,
        },
        images: {
            type: Array,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Category", categorySchema);
