const mongoose = require("mongoose");
const env = require("./env");

async function connectDB() {
  mongoose.set("strictQuery", true);

  const options = {
    serverSelectionTimeoutMS: 8000,
    connectTimeoutMS: 10000,
    socketTimeoutMS: 20000,
    // NOTE: tlsAllowInvalidCertificates was previously set to true here.
    // That disables TLS certificate validation entirely (a man-in-the-middle
    // vulnerability) and is never needed for a normal MongoDB Atlas
    // connection string (mongodb+srv://...), which already negotiates valid
    // TLS by default. Removed — do not re-add this in production.
  };

  try {
    await mongoose.connect(env.mongodbUri, options);
    console.log("[db] MongoDB কানেক্ট হয়েছে");
  } catch (error) {
    console.error("[db] MongoDB কানেক্ট ব্যর্থ:", error.message);
    throw error;
  }

  mongoose.connection.on("error", (err) => {
    console.error("[db] MongoDB কানেকশন এরর:", err.message);
  });

  mongoose.connection.on("disconnected", () => {
    console.warn("[db] MongoDB ডিসকানেক্ট হয়ে গেছে");
  });
}

module.exports = connectDB;
