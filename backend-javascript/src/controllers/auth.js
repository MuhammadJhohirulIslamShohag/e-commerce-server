const User = require("../models/user");
const shortid = require("shortid");

// creating auth controller
exports.create_or_update_user = async (req, res) => {
    try {
      
        let user;
        if(req.body.address){
            // const previousUserInfo = await User.findOne({ email: req.body.address.email }).exec();
            const addressObject = {
                ...req.body.address
            }
            user = await User.findOneAndUpdate(
                { email: req.body.address.email },
               { address: addressObject, username:req.body.address?.username},
                { new: true }
            );
            
        }else{
            if(req.body.image){
                const imageObject = {
                    ...req.body.image
                }
                user = await User.findOneAndUpdate(
                    { email: req.body.email },
                    { image: imageObject},
                    { new: true }
                ); 
            }else{
                user = await User.findOneAndUpdate(
                    { email: req.body.email },
                    { ...req.body},
                    { new: true }
                ); 
            }
        }
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

exports.current_user = async (req, res) => {
    try {
        const { email } = req.user;
        const user = await User.findOne({ email }).exec()
        res.json(user);
    } catch (error) {
        res.status(500).json({
            error: "Something Went Wrong!",
        });
    }
};
