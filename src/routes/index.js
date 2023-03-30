const routers = require("./routers");

const rootRouters = (app) => {
    app.use("/api", routers);
};

module.exports = rootRouters;
