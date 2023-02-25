const cloudinary = require("cloudinary");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// upload images controller
exports.upload = async (req, res) => {
    try {
        let result = await cloudinary.uploader.upload(req.body.uploadImageFile, {
            public_id: `${Date.now()}`,
            resource_type: "auto",
        });
        res.json({
            public_id: result.public_id,
            url: result.secure_url,
        });
    } catch (error) {
        res.status(501).send({ message: "Something Went Wrong!" });
    }
};

// remove image controller
exports.remove = (req, res) => {
    let image_id = req.body.public_id;
    cloudinary.uploader.destroy(image_id, (err, result) => {
        if (err) return res.json({ success: false, err });
        res.status(200).send("OK");
    });
};
