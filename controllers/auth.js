const User = require("../models/user");

// creating auth controller
exports.createOrUpdateUser = async (req, res) => {
    const { name, email, picture } = req.user;

    const user = await User.findOneAndUpdate(
        { email },
        { name: email.split(".")[0], picture },
        { new: true }
    );
    if (user) {
        res.json(user);
    } else {
        const newUser = await new User({
            email,
            name: email.split(".")[0],
            picture,
        }).save();
        res.json(newUser);
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
