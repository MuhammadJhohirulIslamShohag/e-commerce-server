const mongoose = require("mongoose");
const { Schema } = mongoose;
const { ObjectId } = mongoose.Schema;

const userSchema = new Schema(
    {
        name: {
            type: String,
        },
        email: {
            type: String,
            required: true,
            index: true,
        },
        role: {
            type: String,
            default: "subscriber",
        },
        cart: {
            type: Array,
            default: [],
        },
        address: {
            fullName: String,
            address: String,
            city: String,
            postalCode: String,
            country: String,
        },
        wishList: [
            {
                type: ObjectId,
                ref: "Product",
            },
        ],
    },
    { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
