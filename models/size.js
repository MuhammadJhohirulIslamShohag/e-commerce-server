const mongoose = require("mongoose");
const { Schema } = mongoose;

// creating product size schema
const sizeSchema = new Schema(
    {
        name: {
            type: String,
            trim: true,
            required: "Name is required",
            minLength: [1, "Too short"],
            maxLength: [32, "Too long"],
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

module.exports = mongoose.model("Sizes", sizeSchema);
