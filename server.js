// importing library
const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const { readdirSync } = require("fs");
require("dotenv").config({ path: path.resolve(__dirname, "./.env") });

// app
const app = express();

// using middleware
app.use(morgan("dev"));
app.use(bodyParser.json({limit: '100mb'}));
app.use(bodyParser.urlencoded({limit: '100mb', extended: true}));
app.use(cors());

// routes
readdirSync("./routes").map((r) => {
    app.use("/api", require(`./routes/${r}`));
});

const url = process.env.DATABASE;

// connection MongoDB
mongoose
    .connect(url, { useNewUrlParser: true })
    .then(() => {
        const port = process.env.PORT || 5000;
        app.listen(port, () => {
            console.log(`Server Is Running on Port ${port}`);
        });
    })
    .catch((error) => {
        console.log(`Server Connection is Failed, Problem is ${error}`);
    });
