const mongoose = require("mongoose");
const { Schema } = mongoose;

// creating blog schema
const blogSchema = new Schema(
    {
        title: {
            type: String,
            trim: true,
            required: "Title is required",
        },
        image: {
            type: String,
        },
        description: {
            type: String,
            trim: true,
            required: "Description is required",
        },
        publisherName: {
            type: String,
        },
        link: {
            type: String,
            trim: true,
            required: "link is required",
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Blogs", blogSchema);
