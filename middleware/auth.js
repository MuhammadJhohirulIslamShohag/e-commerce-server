// importing firebase
const admin = require("../firebase");
// importing model
const User = require("../models/user");

exports.authCheck = async (req, res, next) => {
    try {
        if (req.headers.token) {
            const firebaseUser = await admin
                .auth()
                .verifyIdToken(req.headers.token);
            req.user = firebaseUser;
            next();
        }
    } catch (error) {
        console.log(error.message);
        res.status(401).json({
            error: "Invalid or expired token",
        });
    }
};

exports.adminCheck = async (req, res, next) => {
    console.log(req.user, "user")
    const { email } = req.user;
    const adminUser = await User.findOne({ email }).exec();

    if (adminUser.role !== "admin") {
        res.status(401).json({
            error: "Admin resource. Access denied",
        });
    } else {
        next();
    }
};
