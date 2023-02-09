const mongoose = require("mongoose");

// connection MongoDB
const connect = async (uri, dbName) => {
    try {
        await mongoose.connect(uri, { useNewUrlParser: true, dbName: dbName });
        console.log("mongodb connected!");
    } catch (error) {
        console.log("mongodb connection failed!");
    }
};

module.exports = {
    connect,
};
