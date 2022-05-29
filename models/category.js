const mongoose = require("mongoose");
const { Schema } = mongoose;

// creating category schema
const categorySchema = new Schema(
    {
        name: {
            type: String,
            trim: true,
            required: "Name is required",
            minlength: [3, "Too short"],
            maxlength: [32, "Too long"],
        },
        slug: {
            type: String,
            unique: true,
            lowercase: true,
            index: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Category", categorySchema);
