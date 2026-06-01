# Google Sheet Email Collection Setup

## Step 1: Create a Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Name it "Email Subscribers" (or whatever you prefer)
4. In row 1, add these headers:
   - A1: `Timestamp`
   - B1: `Email`
   - C1: `Source`

## Step 2: Create Google Apps Script

1. In your Google Sheet, go to **Extensions** → **Apps Script**
2. Delete any code in the editor
3. Paste this code:

```javascript
function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);
    
    // Add row with timestamp, email, and source
    sheet.appendRow([
      new Date(),
      data.email,
      data.source || 'website'
    ]);
    
    // Return success response
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      message: 'Email saved successfully'
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService.createTextOutput("Email collection endpoint is running!");
}
```

4. Click **Save** (💾 icon)
5. Click **Deploy** → **New deployment**
6. Click the gear icon ⚙️ next to "Select type"
7. Choose **Web app**
8. Configure:
   - Description: "Email Collection API"
   - Execute as: **Me**
   - Who has access: **Anyone**
9. Click **Deploy**
10. **Copy the Web app URL** - you'll need this! It looks like:
   `https://script.google.com/macros/s/AKfycby.../exec`
11. Click **Done**

## Step 3: Update Your Site

I'll create an email collection component that uses this URL.

## Step 4: Test It

1. Enter an email on your site
2. Check your Google Sheet - you should see a new row with:
   - Current timestamp
   - The email address
   - Source (e.g., "newsletter", "footer", etc.)

## Notes

- The sheet automatically adds timestamps
- You can add more columns/data as needed
- The script is deployed under your Google account
- It's free and has no rate limits for normal use
- You can export the sheet to CSV anytime for email marketing tools
