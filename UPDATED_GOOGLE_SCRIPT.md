# Updated Google Apps Script

## Problem: Emails not appearing in sheet

## Solution: Update your Google Apps Script with this improved code

### Step 1: Update Your Google Sheet Headers

Make sure Row 1 has these headers:
- A1: `Timestamp`
- B1: `Email`
- C1: `Phone`
- D1: `Source`

### Step 2: Replace the Script Code

1. Go to your Google Sheet
2. Click **Extensions** → **Apps Script**
3. **DELETE** all the existing code
4. **PASTE** this updated code:

```javascript
function doPost(e) {
  try {
    // Log for debugging
    Logger.log('Received POST request');
    
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);
    
    Logger.log('Parsed data: ' + JSON.stringify(data));
    
    // Add row with timestamp, email, phone, and source
    sheet.appendRow([
      new Date(),
      data.email || '',
      data.phone || '',
      data.source || 'website'
    ]);
    
    Logger.log('Row appended successfully');
    
    // Return success response
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      message: 'Email saved successfully'
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    Logger.log('Error: ' + error.toString());
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService.createTextOutput("Email collection endpoint is running!");
}

// Test function - run this to test manually
function testAppendRow() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  sheet.appendRow([
    new Date(),
    'test@example.com',
    '+1234567890',
    'manual_test'
  ]);
  Logger.log('Test row added successfully');
}
```

### Step 3: Save and Deploy

1. Click **Save** (💾)
2. Click **Deploy** → **Manage deployments**
3. Click the **Edit** icon (pencil) next to your existing deployment
4. Change **Version** to **"New version"**
5. Click **Deploy**
6. The URL should stay the same

### Step 4: Test the Script Manually

1. In Apps Script editor, select the `testAppendRow` function from dropdown at top
2. Click **Run** (▶ icon)
3. Check your Google Sheet - you should see a test row appear
4. If it works, the script is fine - the issue is on the website side

### Step 5: Check Website Console

1. Open your website
2. Press F12 (or Cmd+Option+I on Mac) to open Developer Tools
3. Go to **Console** tab
4. Try submitting an email
5. Look for any error messages

Send me what you see in the console!
