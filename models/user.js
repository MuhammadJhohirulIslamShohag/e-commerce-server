const mongoose = require("mongoose");
const { Schema } = mongoose;
const { ObjectId } = mongoose.Schema;

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
        },
        fullName: {
            type: String,
        },
        email: {
            type: String,
            index: true,
            required: true,
            unique: true,
        },
        image: {
            url: {
                type: String,
                default: "https://via.placeholder.com/200x200.png?text=Profile",
            },
            public_id: {
                type: String,
                default: `${Date.now()}`,
            },
        },
        role: {
            type: String,
            default: "user",
        },
        cart: {
            type: Array,
            default: [],
        },
        address: {
            fullName: {
                type: String,
            },
            address: {
                type: String,
            },
            city: {
                type: String,
            },
            postalCode: {
                type: String,
            },
            country: {
                type: String,
            },
        },
        about: {
            type: String,
        },
        wishList: [
            {
                product: {
                    type: ObjectId,
                    ref: "Product",
                },
                isWishList: Boolean,
            },
        ],
    },
    { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
