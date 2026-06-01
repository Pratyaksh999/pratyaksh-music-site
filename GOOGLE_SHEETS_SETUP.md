# Google Sheets Setup - Single Sheet for Everything

Use ONE Google Sheet for both newsletter signups AND login tracking!

## Step 1: Set Up Your Google Sheet

Go to: https://docs.google.com/spreadsheets/d/1YvrrLy-3DILfivwBxy-7_8L6H5RBVcVjemN26dn_qf4/edit

### Create Two Sheets (Tabs):

**Sheet 1: "Newsletter"**
- Rename the first sheet to **"Newsletter"**
- Add headers in row 1:
  ```
  Timestamp | Email | Phone | Source
  ```

**Sheet 2: "Logins"** 
- Click the **+** at the bottom to add a new sheet
- Name it **"Logins"**
- Add headers in row 1:
  ```
  Timestamp | Email | Display Name | UID | Photo URL | Last Sign In | Account Created
  ```

## Step 2: Update Apps Script

1. Click **Extensions** → **Apps Script**
2. Delete ALL existing code
3. Paste this NEW code:

```javascript
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    
    // Route to correct sheet based on source
    if (data.source === 'newsletter_modal') {
      // Newsletter signup - goes to Sheet1
      const sheet = spreadsheet.getSheetByName('Sheet1');
      sheet.appendRow([
        new Date(),
        data.email || '',
        data.phone || '',
        data.source
      ]);
    } else if (data.source === 'login') {
      // User login - goes to Sheet2
      const sheet = spreadsheet.getSheetByName('Sheet2');
      sheet.appendRow([
        data.timestamp,
        data.email || '',
        data.displayName || '',
        data.uid || '',
        data.photoURL || '',
        data.lastSignInTime || '',
        data.creationTime || ''
      ]);
    }
    
    return ContentService.createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

4. Click **Save** (💾)

## Step 3: Deploy

1. Click **Deploy** → **Manage deployments**
2. Click the **Edit** icon (pencil) on your existing deployment
3. Click **Version** → **New version**
4. Click **Deploy**
5. Copy the **Web app URL** (same URL as before)

## Step 4: Update Login Code

Open `/Users/pratyaksh.bharadwaj/Desktop/pratyaksh-music-site/src/utils/googleSheets.js`

Replace:
```javascript
const GOOGLE_SCRIPT_URL = 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE';
```

With the SAME URL you use for newsletter:
```javascript
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzxzsIyuS25KWsLhqhzdLBTy_PGxw6Z-Wv2XbESVkwGu-NFcZudh90QtYrfhZx5qvAOKg/exec';
```

## Done!

Now EVERYTHING goes to the same Google Sheet:
- **Newsletter tab** → Email signups with phone numbers
- **Logins tab** → User login tracking

One Apps Script URL handles both! 🎉
