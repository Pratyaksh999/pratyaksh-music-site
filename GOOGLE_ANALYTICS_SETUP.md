# Google Analytics Setup Guide

## Step 1: Create a Google Analytics Account

1. Go to [Google Analytics](https://analytics.google.com/)
2. Sign in with your Google account
3. Click **"Start measuring"** or **"Admin"** (gear icon)

## Step 2: Create a Property

1. Click **"Create Property"**
2. Fill in the details:
   - **Property name**: "Pratyaksh Music Site" (or your preferred name)
   - **Reporting time zone**: Select your timezone
   - **Currency**: Select your currency
3. Click **"Next"**

## Step 3: Set Up Data Stream

1. Select **"Web"** as the platform
2. Fill in:
   - **Website URL**: Your production URL (e.g., `https://pratyakshbharadwaj.com`)
   - **Stream name**: "Main Website"
3. Click **"Create stream"**

## Step 4: Get Your Measurement ID

1. After creating the stream, you'll see a **Measurement ID** like `G-XXXXXXXXXX`
2. Copy this ID

## Step 5: Add Measurement ID to Your Code

1. Open `/src/components/GoogleAnalytics.jsx`
2. Replace **both** instances of `'G-XXXXXXXXXX'` with your actual Measurement ID:

```javascript
const GA_MEASUREMENT_ID = 'G-ABC123DEF456'; // Your real ID here
```

And also update this line:
```javascript
window.gtag('config', 'G-ABC123DEF456', { // Your real ID here
```

## Step 6: Deploy and Test

1. Deploy your site to production
2. Visit your live website
3. Go back to Google Analytics
4. Click **"Reports"** > **"Realtime"**
5. You should see yourself as an active user!

## What Google Analytics Tracks

- **Total Visitors**: Unique visitors to your site
- **Page Views**: How many pages people view
- **Session Duration**: How long people stay
- **Bounce Rate**: Percentage who leave after one page
- **Traffic Sources**: Where visitors come from (Google, social media, direct)
- **Geographic Data**: Where your visitors are located
- **Device Types**: Desktop, mobile, tablet breakdown
- **Popular Pages**: Which pages get the most views

## Using Analytics Data in Your Dashboard

Once Google Analytics is set up, you can:

1. **Option A**: Keep the current "—" placeholder and tell users to check Google Analytics directly
2. **Option B**: Use Google Analytics Reporting API to pull visitor data into your dashboard (requires additional setup)

For Option B, you would need to:
- Enable Google Analytics Reporting API
- Set up service account credentials
- Fetch visitor data and display in your Analytics dashboard

Let me know if you'd like me to implement Option B for automatic syncing!

## Privacy Considerations

- Google Analytics is GDPR compliant when configured properly
- Consider adding a cookie consent banner
- Add a privacy policy mentioning Google Analytics usage
- You can enable IP anonymization for extra privacy

## Need Help?

If you encounter any issues:
1. Check the browser console for errors
2. Verify your Measurement ID is correct
3. Make sure your site is deployed (GA doesn't work on localhost by default)
4. Wait 24-48 hours for data to fully populate in GA

---

**Note**: Google Analytics takes 24-48 hours to start showing historical data. Real-time data appears immediately!
