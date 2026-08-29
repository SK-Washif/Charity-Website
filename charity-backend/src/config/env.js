require("dotenv").config();

function required(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`[env] প্রয়োজনীয় environment variable "${name}" সেট করা নেই।`);
  }
  return value;
}

function optional(name, defaultValue = "") {
  return process.env[name] || defaultValue;
}

function optionalNumber(name, defaultValue) {
  const value = Number(process.env[name]);
  return isNaN(value) ? defaultValue : value;
}

const env = {
  port: optionalNumber("PORT", 5000),
  nodeEnv: optional("NODE_ENV", "development"),
  isProd: process.env.NODE_ENV === "production",

  // MongoDB
  mongodbUri: required("MONGODB_URI"),
  
  // Clerk
  clerkSecretKey: required("CLERK_SECRET_KEY"),
  clerkPublishableKey: optional("CLERK_PUBLISHABLE_KEY", ""),

  // ImageBB
  imagebbApiKey: optional("IMAGEBB_API_KEY", ""),
  
  // Google Sheets - Required for scholarship
  googleSheetId: required("GOOGLE_SHEET_ID"),
  googleServiceAccountEmail: required("GOOGLE_SERVICE_ACCOUNT_EMAIL"),
  googleServiceAccountPrivateKey: required("GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY").replace(/\\n/g, "\n"),
  
  // Frontend
  frontendOrigin: optional("FRONTEND_ORIGIN", "http://localhost:3000"),
};

module.exports = env;