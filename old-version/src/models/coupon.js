const mongoose = require("mongoose");
const { Schema } = mongoose;

// creating coupon schema
const couponSchema = new Schema(
    {
        name: {
            type: String,
            trim: true,
            uppercase: true,
            required: "Coupon-Name is required",
            unique: true,
            minLength: [4, "To Short"],
            maxLength: [12, "To High"],
            index: true,
        },
        discount: {
            type: Number,
            required: true,
        },
        expiry: {
            type: Date,
            required: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Coupon", couponSchema);
