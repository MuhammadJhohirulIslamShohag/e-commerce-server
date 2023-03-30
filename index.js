// importing library
const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
// const { readdirSync } = require("fs");
const connectWithMongoDB = require("./config/mongo.db.config");
// const rootRouters = require("./routes");
const { adminRouters } = require("./routes/v1/admin");
const { authRouters } = require("./routes/v1/auth");
const { blogRouters } = require("./routes/v1/blog");
const { brandRouters } = require("./routes/v1/brand");
const { categoryRouters } = require("./routes/v1/category");
const { cloudinaryRouters } = require("./routes/v1/cloudinary");
const { colorRouters } = require("./routes/v1/color");
const { couponRouters } = require("./routes/v1/coupon");
const { productRouters } = require("./routes/v1/product");
const { sizeRouters } = require("./routes/v1/size");
const { stripeRouters } = require("./routes/v1/stripe");
const { subCategoryRouters } = require("./routes/v1/sub-category");
const { userRouters } = require("./routes/v1/user");
require("dotenv").config({ path: path.resolve(__dirname, "./.env") });

// app
const app = express();

// using middleware
app.use(morgan("dev"));
app.use(bodyParser.json({ limit: "100mb" }));
app.use(bodyParser.urlencoded({ limit: "100mb", extended: true }));
app.use(cors());

const db_uri = process.env.DATABASE_URI;
const PORT = process.env.PORT || 8000;

// routes
// readdirSync("./routes").map((r) => {
//     app.use("/api", require(`./routes/${r}`));
// });
// rootRouters(app);

app.use("/admin", adminRouters);
app.use("/auth", authRouters);
app.use("/blogs", blogRouters);
app.use("/brands", brandRouters);
app.use("/categories", categoryRouters);
app.use("/cloudinary", cloudinaryRouters);
app.use("/colors", colorRouters);
app.use("/coupons", couponRouters);
app.use("/products", productRouters);
app.use("/sizes", sizeRouters);
app.use("/stripe", stripeRouters);
app.use("/subCategories", subCategoryRouters);
app.use("/subCategories", subCategoryRouters);
app.use("/users", userRouters);

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

// listening the express server
app.listen(PORT, () => {
    connectWithMongoDB(db_uri);
    console.log(`Server Is Running on Port ${PORT}`);
});
