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
    return cachedSheetsClient;
  } catch (error) {
    console.error("[scholarship] Google Sheets client তৈরি ব্যর্থ:", error.message);
    throw error;
  }
}

async function appendScholarshipRow(payload) {
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

  try {
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: env.googleSheetId,
      range: "Sheet1!A1",
      valueInputOption: "USER_ENTERED",
      insertDataOption: "INSERT_ROWS",
      requestBody: { values: [row] },
    });
    return response.data;
  } catch (error) {
  
    console.error("[scholarship] Google Sheets append ব্যর্থ:", error.response?.data || error.message);
    const err = new Error("শিক্ষাবৃত্তির তথ্য সংরক্ষণ করা যায়নি। কিছুক্ষণ পর আবার চেষ্টা করুন।");
    err.status = 502;
    throw err;
  }
}

async function checkSheetConnection() {
  try {
    const sheets = getSheetsClient();
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: env.googleSheetId,
      range: "Sheet1!A1:O1",
    });
    return Array.isArray(response.data.values) && response.data.values.length > 0;
  } catch (error) {
    console.error("[scholarship] Sheet connection test ব্যর্থ:", error.message);
    return false;
  }
}

module.exports = { appendScholarshipRow, COLUMN_ORDER, checkSheetConnection };
