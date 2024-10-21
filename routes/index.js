const { usersRoutes } = require("../services/users");
const { categoryRoutes } = require("../services/category");
const { StripeRoutes } = require("../services/stripe");

const initialize = (app) => {
  app.use("/api/users", usersRoutes);
  app.use("/api/category", categoryRoutes);
  app.use("/api/stripe", StripeRoutes);

  app.use("/authError", (req, res, next) => {
    return next(new Error("DEFAULT_AUTH"));
  });

  app.get("/ping", (req, res) => {
    res.status(200).send({
      success: true,
      statusCode: 200,
    });
  });
};

module.exports = { initialize };
