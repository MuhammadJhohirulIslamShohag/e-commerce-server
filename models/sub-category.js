const mongoose = require("mongoose");
const { Schema } = mongoose;
const { ObjectId } = mongoose.Schema;

// creating sub category schema
const subCategorySchema = new Schema(
    {
        name: {
            type: String,
            trim: true,
            required: "Name is required",
            minlength: [3, "Too Short"],
            maxlength: [33, "Too Long"],
        },
        slug: {
            type: String,
            unique: true,
            lowercase: true,
            index: true,
        },
        parent: {
            type: ObjectId,
            ref: "Category",
            required: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("SubCategory", subCategorySchema);
