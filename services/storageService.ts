import { UserAnswers, Product, Feedback } from '../types';

/**
 * =======================================================================================
 * HOW TO SET UP GOOGLE SHEETS STORAGE
 * =======================================================================================
 * This service is configured to send data to a Google Sheet via a Google Apps Script
 * Web App. This method is secure as it doesn't expose any private keys on the client-side.
 *
 * --- STEP 1: CREATE YOUR GOOGLE SHEET ---
 * 1. Go to sheets.google.com and create a new blank sheet.
 * 2. The script will automatically use the FIRST SHEET (the leftmost tab at the bottom).
 *    You don't need to rename it, but you can if you want.
 * 3. In the first row (Row 1) of this first sheet, create the following headers, one in each cell from A1, B1, C1, etc.
 *    The order does not matter, but the names MUST MATCH EXACTLY (they are case-sensitive):
 *
 *    timestamp
 *    recordId
 *    feedbackRating
 *    feedbackComment
 *    userCorrectedIdeal
 *    userCorrectedStrong
 *    priorityWeights
 *    generatedSuggestion
 *    originalIdealProduct
 *    originalStrongProduct
 *    industry
 *    orgSize
 *    users
 *    budgetMin
 *    budgetMax
 *    goLiveTimeline
 *    tradingType
 *    currentSystem
 *    priorities
 *    region
 *    integrations
 *
 * --- STEP 2: CREATE THE GOOGLE APPS SCRIPT ---
 * 1. In your Google Sheet, go to "Extensions" > "Apps Script".
 * 2. Delete any boilerplate code in the `Code.gs` file and paste the entire script below.
 * 3. Save the script project (File > Save project). Give it a name like "FeedbackReceiver".
 *
 * ----- COPY THIS ENTIRE SCRIPT -----
 * function doPost(e) {
 *   try {
 *     // This is more robust: it gets the first sheet in the spreadsheet file,
 *     // regardless of its name. This avoids errors if the sheet isn't named correctly.
 *     var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
 *     
 *     var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
 *     var data = JSON.parse(e.postData.contents);
 *     
 *     var newRow = headers.map(function(header) {
 *       return data[header] !== undefined ? data[header] : null;
 *     });
 *     
 *     sheet.appendRow(newRow);
 *     
 *     return ContentService.createTextOutput(JSON.stringify({ "status": "success" }))
 *       .setMimeType(ContentService.MimeType.JSON);
 *   } catch (error) {
 *     // Log detailed errors to help with debugging inside the Apps Script editor.
 *     Logger.log(JSON.stringify(e));
 *     Logger.log(error);
 *     return ContentService.createTextOutput(JSON.stringify({ "status": "error", "message": error.toString() }))
 *       .setMimeType(ContentService.MimeType.JSON);
 *   }
 * }
 * -------------------------------------
 *
 * --- STEP 3: DEPLOY THE SCRIPT AS A WEB APP ---
 * 1. In the Apps Script editor, click the "Deploy" button and select "New deployment".
 * 2. Click the gear icon next to "Select type" and choose "Web app".
 * 3. In the "Configuration" section:
 *    - For "Description", you can add something like "Receives feedback for ION app".
 *    - For "Execute as", select "Me".
 *    - For "Who has access", select "Anyone". **THIS IS REQUIRED**. It allows the web app to receive data.
 * 4. Click "Deploy". Authorize access if prompted (you may need to click "Advanced" and "Go to...").
 * 5. Copy the "Web app URL" it provides.
 *
 * --- STEP 4: CONFIGURE THIS FILE ---
 * 1. Paste the "Web app URL" you copied into the `GOOGLE_SCRIPT_URL` constant below.
 *
 * ★★★ IMPORTANT: IF YOU EDIT THE SCRIPT, YOU MUST RE-DEPLOY! ★★★
 * Simply saving the script DOES NOT update the live web app.
 * 1. Click "Deploy" > "Manage deployments".
 * 2. Select your active deployment and click the pencil icon (Edit).
 * 3. Change the version from "Existing version" to "New version".
 * 4. Click "Deploy".
 *
 * =======================================================================================
 * --- TROUBLESHOOTING: DATA NOT APPEARING? ---
 * 1. RE-DEPLOY: Did you follow the "IMPORTANT" step above after changing the script?
 * 2. CHECK EXECUTIONS: In Apps Script, click the "Executions" icon (a clock) on the left.
 *    Look for `doPost` entries that have failed. Click on them to see the error details.
 * 3. CHECK HEADERS: Are the headers in your sheet spelled EXACTLY as listed above?
 * =======================================================================================
 */

// ***************************************************************************************
// PASTE YOUR GOOGLE APPS SCRIPT WEB APP URL HERE
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzTj0ylZwxrNcROkHDORSUfwIwCci_ldoxq5G0ejdRFpt6LMGiti7niRc5-BWJhtGWLfA/exec'; // <-- e.g., 'https://script.google.com/macros/s/...'
// ***************************************************************************************


/**
 * Saves a complete recommendation record.
 * If GOOGLE_SCRIPT_URL is configured, it sends the data to the Google Sheet.
 * Otherwise, it falls back to logging to the console.
 *
 * @param answers - The user's answers from the questionnaire.
 * @param recommendations - The ideal and strong product recommendations.
 * @param feedback - The user's feedback on the recommendation.
 */
export const saveRecommendationRecord = async (
  answers: UserAnswers,
  recommendations: { ideal: Product; strong: Product },
  feedback: Feedback
): Promise<void> => {
  // Flatten the data into a single object for logging/sending.
  const recordPayload = {
    timestamp: new Date().toISOString(),
    recordId: crypto.randomUUID(),
    feedbackRating: feedback.rating,
    feedbackComment: feedback.comment || null,
    userCorrectedIdeal: feedback.userCorrection?.ideal || null,
    userCorrectedStrong: feedback.userCorrection?.strong || null,
    priorityWeights: feedback.priorityWeights ? JSON.stringify(feedback.priorityWeights) : null,
    generatedSuggestion: feedback.generatedSuggestion || null,
    originalIdealProduct: recommendations.ideal.name,
    originalStrongProduct: recommendations.strong.name,
    industry: answers.industry,
    orgSize: answers.orgSize,
    users: answers.users,
    budgetMin: answers.expectedBudget.min,
    budgetMax: answers.expectedBudget.max,
    goLiveTimeline: answers.goLiveTimeline,
    tradingType: answers.tradingType,
    currentSystem: answers.currentSystem,
    priorities: answers.priorities.join(', '),
    region: answers.region,
    integrations: answers.integrations.join(', '),
  };

  if (!GOOGLE_SCRIPT_URL) {
    console.warn("--- GOOGLE_SCRIPT_URL is not configured. Falling back to console logging. ---");
    console.warn("--- See instructions in services/storageService.ts to set up Google Sheets. ---");
    console.log("--- Simulating server-side storage ---");
    console.log("Received new recommendation record to store:");
    console.log(JSON.stringify(recordPayload, null, 2));
    console.log("---------------------------------------");
    // Simulate a network delay for a more realistic UI experience.
    await new Promise(resolve => setTimeout(resolve, 750));
    return Promise.resolve();
  }

  // If URL is configured, send the data to the Google Apps Script
  try {
    const res = await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors', // This is required to call a Google Apps Script from a browser without complex CORS errors.
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(recordPayload),
    });
    console.log("Feedback data submission request sent to Google Sheets.");
    // NOTE: With 'no-cors', we cannot inspect the response to confirm success.
    // The request is "fire-and-forget". You can confirm data is arriving by checking your Google Sheet.
  } catch (error) {
    console.error("Failed to send data to Google Sheets:", error);
    // Re-throw the error to let the UI know something went wrong.
    throw new Error("Could not save feedback to Google Sheets.");
  }
};