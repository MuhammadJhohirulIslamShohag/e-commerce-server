const mongoose = require("mongoose");
const { Schema } = mongoose;

// creating brand schema
const brandSchema = new Schema(
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
    },
    { timestamps: true }
);

module.exports = mongoose.model("Brand", brandSchema);
