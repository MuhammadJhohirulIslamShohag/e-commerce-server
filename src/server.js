const app = require("./app");
const path = require("path");
const connectWithMongoDB = require("./config/mongo.db.config");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const start = () => {
    const db_uri = process.env.DATABASE_URI;
    const PORT = process.env.PORT || 8000;
    connectWithMongoDB(db_uri);

    // listening the express server
    app.listen(PORT, () => {
        connectWithMongoDB(db_uri);
        console.log(`Server Is Running on Port ${PORT}`);
    });
};

start();
