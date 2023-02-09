const User = require("../models/user");
const shortid = require("shortid");

// creating auth controller
exports.createOrUpdateUser = async (req, res) => {
    try {
        const user = await User.findOneAndUpdate(
            { email:req.body.email },
            { ...req.body, username: shortid.generate() },
            { new: true }
        );
        if (user) {
            res.json(user);
        } else {
            const newUser = await new User({
                ...req.body,
                username: shortid.generate(),
            }).save();
            res.json(newUser);
        }
    } catch (error) {
        res.status(500).json({
            error: "Something Went Wrong!",
        });
    }
};

exports.currentUser = async (req, res) => {
    const { email } = req.user;
    await User.findOne({ email }).exec((error, user) => {
        if (error) {
            console.log(error);
        }
        res.json(user);
    });
};
