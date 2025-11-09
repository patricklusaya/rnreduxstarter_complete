# Firebase Setup Guide

This guide will help you configure Firebase for your Notes app.

## Step 1: Get Your Firebase Configuration

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project (or create a new one)
3. Click on the gear icon ⚙️ next to "Project Overview"
4. Select "Project settings"
5. Scroll down to "Your apps" section
6. If you don't have a web app, click "Add app" and select the web icon (</>)
7. Copy your Firebase configuration values

## Step 2: Create Environment File

Create a `.env` file in the root of your project with the following variables:

```env
EXPO_PUBLIC_FIREBASE_API_KEY=your-api-key-here
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
EXPO_PUBLIC_FIREBASE_APP_ID=your-app-id
```

Replace the placeholder values with your actual Firebase configuration values.

## Step 3: Set Up Firestore Database

1. In Firebase Console, go to "Firestore Database"
2. Click "Create database"
3. Start in **test mode** (for development) or **production mode** (for production)
4. Select a location for your database
5. Click "Enable"

### Firestore Security Rules (for test mode)

For development, you can use these rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /notes/{document=**} {
      allow read, write: if true;
    }
  }
}
```

**⚠️ Warning:** These rules allow anyone to read/write. For production, implement proper authentication and security rules.

## Step 4: Update Firebase Config

Update `config/firebase.ts` with your Firebase configuration values, or ensure your `.env` file is properly set up.

## Step 5: Test the Connection

Run your app and try creating a note. Check the Firebase Console > Firestore Database to see if notes are being saved.

## Troubleshooting

- **"Firebase: Error (auth/configuration-not-found)"**: Make sure your `.env` file exists and has all required variables
- **"Permission denied"**: Check your Firestore security rules
- **Notes not appearing**: Check the browser console or React Native debugger for errors

## Next Steps

- Set up Firebase Authentication for user-specific notes
- Implement proper Firestore security rules
- Add offline persistence for better user experience

