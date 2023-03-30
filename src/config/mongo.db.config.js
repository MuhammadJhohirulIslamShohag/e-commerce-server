const mongoose = require("mongoose");

const connectWithMongoDB = (uri) => {
    try {
        if (!uri) {
            throw new Error("MONGO_URL must be defined");
        }
        mongoose
            .connect(uri, {
                dbName: "ecommerce",
                useNewUrlParser: true,
                useUnifiedTopology: true,
            })
            .then((db) => {
                console.log("MongoDB Database is connected!");
            })
            .catch((err) => {
                console.log("Error Connecting to the Database");
            });
    } catch (error) {
        console.log(`MongoDB connection is failed!. ${error}`);
    }
};

module.exports = connectWithMongoDB;
