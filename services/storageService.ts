import { UserAnswers, Product, Feedback, LeadDetails } from '../types';
 
/**
 * =======================================================================================
 * HOW TO SET UP GOOGLE SHEETS STORAGE (FOR LEADS & FEEDBACK)
 * =======================================================================================
 * This service is configured to send two types of data (Leads and Feedback) to a
 * single Google Sheet file via one Google Apps Script Web App.
 *
 * --- STEP 1: CREATE YOUR GOOGLE SHEET ---
 * 1. Go to sheets.google.com and create a new blank sheet.
 * 2. This setup uses two tabs (sheets) within the same file.
 * 3. Rename the first sheet tab (at the bottom left) to exactly "Feedback".
 * 4. Create a new sheet tab by clicking the "+" icon and rename it to exactly "Leads".
 * 5. Set up the headers for EACH sheet as described below. The first row of each sheet
 *    must contain these headers. The order does not matter, but the names MUST MATCH EXACTLY.
 *
 *    HEADERS FOR "Feedback" SHEET:
 *    timestamp, recordId, feedbackRating, feedbackComment, userCorrectedIdeal,
 *    userCorrectedStrong, priorityWeights, generatedSuggestion, originalIdealProduct,
 *    originalStrongProduct, industry, orgSize, users, budgetMin, budgetMax,
 *    goLiveTimeline, tradingType, currentSystem, technologyPreference,
 *    priorities, region, integrations
 *
 *    HEADERS FOR "Leads" SHEET:
 *    timestamp, leadId, fullName, companyName, email, phone, notes,
 *    recommendedProductIdeal, recommendedProductStrong
 *
 * --- STEP 2: CREATE THE GOOGLE APPS SCRIPT ---
 * 1. In your Google Sheet, go to "Extensions" > "Apps Script".
 * 2. Delete any boilerplate code in the `Code.gs` file and paste the entire script below.
 * 3. Save the script project (File > Save project). Give it a name like "DataReceiver".
 *
 * ----- COPY THIS ENTIRE SCRIPT -----
 * function doPost(e) {
 *   try {
 *     var data = JSON.parse(e.postData.contents);
 *     var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
 *     var sheet;
 *
 *     // Determine which sheet to write to based on the 'dataType' field in the payload
 *     if (data.dataType === 'lead') {
 *       sheet = spreadsheet.getSheetByName("Leads");
 *       if (!sheet) { throw new Error("Sheet 'Leads' not found."); }
 *     } else { // Default to feedback
 *       sheet = spreadsheet.getSheetByName("Feedback");
 *       if (!sheet) { throw new Error("Sheet 'Feedback' not found."); }
 *     }
 *
 *     var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
 *     var newRow = headers.map(function(header) {
 *       // Check if the property exists in data, otherwise return null
 *       // This prevents 'undefined' from being written to the sheet
 *       return data.hasOwnProperty(header) ? data[header] : null;
 *     });
 *
 *     sheet.appendRow(newRow);
 *
 *     return ContentService.createTextOutput(JSON.stringify({ "status": "success" }))
 *       .setMimeType(ContentService.MimeType.JSON);
 *   } catch (error) {
 *     Logger.log(JSON.stringify(e)); // Log incoming data for debugging
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
 *    - For "Execute as", select "Me".
 *    - For "Who has access", select "Anyone". **THIS IS REQUIRED**.
 * 4. Click "Deploy". Authorize access if prompted.
 * 5. Copy the "Web app URL" it provides.
 *
 * --- STEP 4: CONFIGURE THIS FILE ---
 * 1. Paste the "Web app URL" you copied into the `GOOGLE_SCRIPT_URL` constant below.
 *
 * ★★★ IMPORTANT: IF YOU EDIT THE SCRIPT, YOU MUST CREATE A NEW DEPLOYMENT VERSION! ★★★
 * 1. Click "Deploy" > "Manage deployments".
 * 2. Select your active deployment, click the pencil icon (Edit).
 * 3. Change the version to "New version".
 * 4. Click "Deploy".
 *
 * =======================================================================================
 */
 
// ***************************************************************************************
// PASTE YOUR GOOGLE APPS SCRIPT WEB APP URL HERE
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzTj0ylZwxrNcROkHDORSUfwIwCci_ldoxq5G0ejdRFpt6LMGiti7niRc5-BWJhtGWLfA/exec%27; // <-- e.g., 'https://script.google.com/macros/s/...'
// ***************************************************************************************
 
 
/**
 * Sends data to the configured Google Apps Script URL.
 * @param payload - The data object to send. Must include a `dataType` property.
 */
const sendData = async (payload: object): Promise<void> => {
    if (!GOOGLE_SCRIPT_URL) {
        console.warn("--- GOOGLE_SCRIPT_URL is not configured. Falling back to console logging. ---");
        console.warn("--- See instructions in services/storageService.ts to set up Google Sheets. ---");
        console.log("--- Simulating server-side storage ---");
        console.log("Received new record to store:");
        console.log(JSON.stringify(payload, null, 2));
        console.log("---------------------------------------");
        await new Promise(resolve => setTimeout(resolve, 750));
        return Promise.resolve();
    }
 
    try {
        await fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });
        console.log(`'${(payload as any).dataType}' data submission request sent to Google Sheets.`);
    } catch (error) {
        console.error("Failed to send data to Google Sheets:", error);
        throw new Error("Could not save data to Google Sheets.");
    }
};
 
/**
 * Saves a complete recommendation feedback record.
 */
export const saveRecommendationRecord = async (
  answers: UserAnswers,
  recommendations: { ideal: Product; strong: Product },
  feedback: Feedback
): Promise<void> => {
  const recordPayload = {
    dataType: 'feedback',
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
    technologyPreference: answers.technologyPreference,
    priorities: answers.priorities.join(', '),
    region: answers.region,
    integrations: answers.integrations.join(', '),
  };
 
  await sendData(recordPayload);
};
 
/**
 * Saves a lead capture record.
 */
export const saveLeadRecord = async (
    leadDetails: LeadDetails,
    recommendations: { ideal: Product; strong: Product }
): Promise<void> => {
    const leadPayload = {
        dataType: 'lead',
        timestamp: new Date().toISOString(),
        leadId: crypto.randomUUID(),
        fullName: leadDetails.fullName,
        companyName: leadDetails.companyName,
        email: leadDetails.email,
        phone: leadDetails.phone || null,
        notes: leadDetails.notes || null,
        recommendedProductIdeal: recommendations.ideal.name,
        recommendedProductStrong: recommendations.strong.name,
    };
 
    await sendData(leadPayload);
};
