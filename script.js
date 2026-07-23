// =====================================================
// CBSE Homework AI
// Google Apps Script - Code.gs
// Batch 1
// =====================================================

// Sheet Name
const SHEET_NAME = "Registrations";

// ------------------------------------
// Handle POST Requests
// ------------------------------------
function doPost(e) {

  try {

    const data = JSON.parse(e.postData.contents);

    const sheet = getRegistrationSheet();
const existingRow = findRegistrationByMobile(sheet, data.mobile);

if (existingRow !== -1) {

  return ContentService
    .createTextOutput(JSON.stringify({
      success: true,
      existing: true,
      message: "Student already registered."
    }))
    .setMimeType(ContentService.MimeType.JSON);

}
    

    sheet.appendRow([

      new Date(),

      data.name || "",

      data.mobile || "",

      data.email || "",
getDeviceName(data.device),
      

      data.trialStart || "",

      "FREE"

    ]);

    return ContentService
      .createTextOutput(JSON.stringify({

        success: true,

        message: "Registration Successful"

      }))
      .setMimeType(ContentService.MimeType.JSON);

  }

  catch(err){

    return ContentService
      .createTextOutput(JSON.stringify({

        success:false,

        error:err.toString()

      }))
      .setMimeType(ContentService.MimeType.JSON);

  }

}
// =====================================================
// Batch 2
// Sheet Creator & Header Generator
// =====================================================

function getRegistrationSheet() {

  const ss = SpreadsheetApp.getActiveSpreadsheet();

  let sheet = ss.getSheetByName(SHEET_NAME);

  // Create sheet if it doesn't exist
  if (!sheet) {

    sheet = ss.insertSheet(SHEET_NAME);

  }

  // Add header row if empty
  if (sheet.getLastRow() === 0) {

    sheet.appendRow([

      "Timestamp",
      "Student Name",
      "Mobile",
      "Email",
      "Device",
      "Trial Start",
      "Plan"

    ]);

    // Make header bold
    sheet.getRange(1, 1, 1, 7)
         .setFontWeight("bold");

    // Freeze header row
    sheet.setFrozenRows(1);

    // Auto resize columns
    sheet.autoResizeColumns(1, 7);

  }

  return sheet;

}

// =====================================================
// Device Information
// =====================================================

function getDeviceName(userAgent) {

  if (!userAgent) return "Unknown Device";

  userAgent = userAgent.toLowerCase();

  if (userAgent.includes("android"))
    return "Android";

  if (userAgent.includes("iphone"))
    return "iPhone";

  if (userAgent.includes("ipad"))
    return "iPad";

  if (userAgent.includes("windows"))
    return "Windows PC";

  if (userAgent.includes("mac"))
    return "Mac";

  if (userAgent.includes("linux"))
    return "Linux";

  return "Unknown Device";

}
// =====================================================
// Batch 3
// Duplicate Registration Check
// =====================================================

function findRegistrationByMobile(sheet, mobile) {

  if (!mobile) return -1;

  const values = sheet.getDataRange().getValues();

  // Skip header row
  for (let i = 1; i < values.length; i++) {

    if (String(values[i][2]).trim() === String(mobile).trim()) {
      return i + 1; // Spreadsheet row number
    }

  }

  return -1;

}

