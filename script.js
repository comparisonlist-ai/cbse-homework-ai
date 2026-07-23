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

    sheet.appendRow([

      new Date(),

      data.name || "",

      data.mobile || "",

      data.email || "",

      data.device || "",

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
