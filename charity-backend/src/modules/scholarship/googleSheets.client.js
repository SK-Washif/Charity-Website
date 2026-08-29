const { google } = require("googleapis");
const env = require("../../config/env");

const COLUMN_ORDER = [
  "submittedAt", "hscGroup", "studentNameEn", "fatherNameEn", "motherNameEn",
  "studentMobile", "gender", "permanentAddress", "currentAddress",
  "gpa", "gpaWithout4th", "guardianYearlyIncome",
  "hasDisability", "disabilityType", "siblingsCount",
];

let cachedSheetsClient = null;

function getSheetsClient() {
  if (cachedSheetsClient) return cachedSheetsClient;
  
  //Debug: Check if credentials exist
  console.log("📥 Google Service Account Email:", env.googleServiceAccountEmail);
  console.log("📥 Google Sheet ID:", env.googleSheetId);
  console.log("📥 Private Key exists:", !!env.googleServiceAccountPrivateKey);
  
  if (!env.googleServiceAccountEmail || !env.googleServiceAccountPrivateKey) {
    const err = new Error("Google Service Account কনফিগার করা নেই।");
    err.status = 500;
    throw err;
  }
  
  try {
    const auth = new google.auth.JWT({
      email: env.googleServiceAccountEmail,
      key: env.googleServiceAccountPrivateKey,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });
    
    cachedSheetsClient = google.sheets({ version: "v4", auth });
    console.log("Google Sheets client created successfully");
    return cachedSheetsClient;
  } catch (error) {
    console.error("Failed to create Google Sheets client:", error.message);
    throw error;
  }
}

async function appendScholarshipRow(payload) {
  console.log("📤 Appending scholarship row to Google Sheets...");
  console.log("📤 Payload:", payload);
  
  if (!env.googleSheetId) {
    const err = new Error("GOOGLE_SHEET_ID কনফিগার করা নেই।");
    err.status = 500;
    throw err;
  }
  
  const sheets = getSheetsClient();
  const row = COLUMN_ORDER.map((key) => {
    const value = payload[key] ?? "";
    return value.toString();
  });
  
  console.log("📤 Row data:", row);
  
  try {
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: env.googleSheetId,
      range: "Sheet1!A1", // Make sure sheet name matches
      valueInputOption: "USER_ENTERED",
      insertDataOption: "INSERT_ROWS",
      requestBody: { values: [row] },
    });
    
    console.log(" Google Sheets append successful:", response.data);
    return response.data;
  } catch (error) {
    console.error(" Google Sheets append failed:", error.message);
    console.error(" Error details:", error.response?.data || error);
    throw error;
  }
}

//Function to check if sheet exists and has headers
async function checkSheetConnection() {
  try {
    const sheets = getSheetsClient();
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: env.googleSheetId,
      range: "Sheet1!A1:O1",
    });
    console.log("Sheet connection successful. Headers:", response.data.values);
    return true;
  } catch (error) {
    console.error("Sheet connection failed:", error.message);
    return false;
  }
}

module.exports = { appendScholarshipRow, COLUMN_ORDER, checkSheetConnection };