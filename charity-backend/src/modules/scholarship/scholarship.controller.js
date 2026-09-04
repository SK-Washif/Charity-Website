const asyncHandler = require("../../utils/asyncHandler");
const { ok } = require("../../utils/apiResponse");
const env = require("../../config/env");
const { validateScholarship } = require("./validator");
const { appendScholarshipRow, checkSheetConnection } = require("./googleSheets.client");

exports.submit = asyncHandler(async (req, res) => {
  
  if (!env.isProd) {
    console.log("📥 Scholarship submission received:", req.body);
  }

 
  const payload = validateScholarship({
    submittedAt: new Date().toISOString(),
    ...req.body,
  });

  
  await appendScholarshipRow(payload);

  return ok(res, { submitted: true }, 201);
});


exports.testConnection = asyncHandler(async (req, res) => {
  const isConnected = await checkSheetConnection();
  return ok(res, {
    connected: isConnected,
    sheetId: env.googleSheetId ? "Set" : "Not Set",
    email: env.googleServiceAccountEmail ? "Set" : "Not Set",
    privateKey: env.googleServiceAccountPrivateKey ? "Set" : "Not Set",
  });
});
