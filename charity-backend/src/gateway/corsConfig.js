const env = require("../config/env");

const corsOptions = {
  origin: env.frontendOrigin,
  credentials: true,
};

module.exports = corsOptions;