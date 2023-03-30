// importing library
const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");

// const { readdirSync } = require("fs");
const rootRouters = require("./routes");

// app
const app = express();

// using middleware
app.use(morgan("dev"));
app.use(bodyParser.json({ limit: "100mb" }));
app.use(bodyParser.urlencoded({ limit: "100mb", extended: true }));
app.use(cors());

// routes
// readdirSync("./routes").map((r) => {
//     app.use("/api", require(`./routes/${r}`));
// });
rootRouters(app);

app.get("/", (req, res) => {
    res.send("E-Commerce-Aladin server is running");
});

app.all("*", (req, res) => {
    res.send("No route found!");
});

process.on("unhandledRejection", (error) => {
    console.log(error.message);
    app.close(() => {
        process.exit(1);
    });
});

module.exports = app;
