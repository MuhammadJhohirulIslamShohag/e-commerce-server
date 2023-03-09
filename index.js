// importing library
const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const { readdirSync } = require("fs");
const { connect } = require("./config/db/mongo");
require("dotenv").config({ path: path.resolve(__dirname, "./.env") });

// app
const app = express();

// using middleware
app.use(morgan("dev"));
app.use(bodyParser.json({ limit: "100mb" }));
app.use(bodyParser.urlencoded({ limit: "100mb", extended: true }));
app.use(cors());

// routes
readdirSync("./routes").map((r) => {
    app.use("/api", require(`./routes/${r}`));
});

const db_uri = process.env.DATABASE_URI;
const db_name = process.env.DATABASE_NAME;
const port = process.env.PORT || 8000;

app.get("/api", (req, res) => {
    res.send("E-Commerce-Aladin server is running");
});

app.listen(port, async () => {
    await connect(db_uri, db_name)
    console.log(`Server Is Running on Port ${port}`);
});
