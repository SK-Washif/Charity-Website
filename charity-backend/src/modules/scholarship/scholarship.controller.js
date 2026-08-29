const asyncHandler = require("../../utils/asyncHandler");
const { ok, fail } = require("../../utils/apiResponse");
const { validateScholarship } = require("./validator");
const { appendScholarshipRow, checkSheetConnection } = require("./googleSheets.client");

exports.submit = asyncHandler(async (req, res) => {
  console.log("📥 Scholarship submission received:", req.body);
  
  try {
    //Validate payload
    const payload = validateScholarship({
      submittedAt: new Date().toISOString(),
      ...req.body,
    });
    
    console.log("Payload validated:", payload);
    
    //Check Google Sheets connection first
    const isConnected = await checkSheetConnection();
    if (!isConnected) {
      console.warn("⚠️ Google Sheets connection failed, but continuing...");
      // Continue anyway, but log warning
    }
    
    //Append to Google Sheets
    await appendScholarshipRow(payload);
    
    console.log("Scholarship submitted successfully to Google Sheets");
    return ok(res, { submitted: true }, 201);
    
  } catch (error) {
    console.error("❌ Scholarship submission error:", error);
    
    //Return detailed error for debugging
    return fail(res, 500, error.message || "সাবমিশন ব্যর্থ হয়েছে।");
  }
});

//Test endpoint to check Google Sheets connection
exports.testConnection = asyncHandler(async (req, res) => {
  const isConnected = await checkSheetConnection();
  return ok(res, { 
    connected: isConnected,
    sheetId: process.env.GOOGLE_SHEET_ID ? "Set" : "Not Set",
    email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL ? "Set" : "Not Set",
    privateKey: process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY ? "Set" : "Not Set",
  });
});