const mongoose = require("mongoose");
const env = require("./env");

async function connectDB() {
  mongoose.set("strictQuery", true);

  const options = {
    serverSelectionTimeoutMS: 8000,
    connectTimeoutMS: 10000,
    socketTimeoutMS: 20000,
    tls: true,
    tlsAllowInvalidCertificates: true, 
    // tlsAllowInvalidHostnames: true, 
    // tlsInsecure: true,              
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