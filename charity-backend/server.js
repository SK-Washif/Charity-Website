const env = require("./src/config/env");
const connectDB = require("./src/config/db");
const app = require("./src/app");

async function start() {
  try {
    await connectDB();
    app.listen(env.port, () => {
      console.log(
        `[server] charity-backend চলছে http://localhost:${env.port} এ (${env.nodeEnv})`
      );
    });
  } catch (err) {
    console.error("[server] বুট হতে ব্যর্থ:", err.message);
    process.exit(1);
  }
}

start();