const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const { clerkMiddleware } = require("@clerk/express");
const env = require("./config/env");
const corsOptions = require("./gateway/corsConfig");
const { generalLimiter } = require("./gateway/middlewares/rateLimiter");
const { errorHandler, notFoundHandler } = require("./gateway/middlewares/errorHandler");
const gatewayRouter = require("./gateway");

const app = express();

app.set("trust proxy", 1);
app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json({ limit: "2mb" }));
app.use(morgan(env.isProd ? "combined" : "dev"));
app.use(generalLimiter);

// Clerk Middleware
app.use(clerkMiddleware({
  secretKey: env.clerkSecretKey,
  publishableKey: env.clerkPublishableKey,
}));

app.use("/api", gatewayRouter);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;