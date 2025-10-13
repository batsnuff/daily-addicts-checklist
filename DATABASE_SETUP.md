# 🗄️ Database Setup Guide

## Overview

Your Daily Addicts Checklist now includes a powerful database system that works across multiple devices with offline support and automatic synchronization.

## 🚀 Features

- **Offline First**: All data is stored locally using IndexedDB for fast access
- **Auto Sync**: Changes are automatically synchronized when online
- **Multi-Device**: Data syncs across all your devices when connected
- **Conflict Resolution**: Latest changes take precedence in case of conflicts
- **Real-time Status**: Visual indicators show sync status and pending changes

## 🔧 Setup Instructions

### 1. Firebase Configuration

1. **Create a Firebase Project**:
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project
   - Enable Firestore Database
   - Set up authentication (optional)

2. **Get Your Configuration**:
   - Go to Project Settings > General
   - Scroll down to "Your apps" section
   - Add a web app if you haven't already
   - Copy the configuration values

3. **Configure Environment Variables**:
   ```bash
   # Copy the example file
   cp env.example .env
   
   # Edit .env with your Firebase configuration
   REACT_APP_FIREBASE_API_KEY=your_api_key_here
   REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   REACT_APP_FIREBASE_PROJECT_ID=your_project_id
   REACT_APP_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789
   REACT_APP_FIREBASE_APP_ID=1:123456789:web:your_app_id
   ```

### 2. Firestore Security Rules

Add these rules to your Firestore database:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read/write access to daily and weekly data
    match /dailyData/{date} {
      allow read, write: if true; // Adjust based on your auth needs
    }
    
    match /weeklyData/{weekStart} {
      allow read, write: if true; // Adjust based on your auth needs
    }
  }
}
```

### 3. Development Setup (Optional)

For local development with Firebase emulators:

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase in your project
firebase init

# Start emulators
firebase emulators:start
```

Set `REACT_APP_USE_EMULATORS=true` in your `.env` file.

## 📱 How It Works

### Data Flow

1. **Local Storage**: All data is first saved to IndexedDB (local browser storage)
2. **Sync Queue**: Changes are queued for synchronization
3. **Auto Sync**: When online, changes are automatically synced to Firebase
4. **Multi-Device**: Other devices pull the latest data when they come online

### Database Structure

```
DailyAddictsDB (IndexedDB)
├── dailyData (object store)
│   ├── id: date (e.g., "2024-01-15")
│   ├── tasks: Task[]
│   ├── batsnackPoints: number
│   └── lastModified: timestamp
├── weeklyData (object store)
│   ├── id: weekStart (e.g., "2024-01-15")
│   ├── dailyData: DailyData[]
│   ├── totalPoints: number
│   └── lastModified: timestamp
├── syncQueue (object store)
│   ├── operation: string
│   ├── data: any
│   ├── timestamp: string
│   └── synced: boolean
└── userSettings (object store)
    └── key: string
```

### Firebase Collections

```
/dailyData/{date}
├── tasks: Task[]
├── batsnackPoints: number
├── notes: string
├── generalNote: string
└── lastModified: timestamp

/weeklyData/{weekStart}
├── weekStart: string
├── weekEnd: string
├── dailyData: DailyData[]
├── totalPoints: number
├── ranking: string
└── lastModified: timestamp
```

## 🎛️ Database Management

### Access Database Settings

1. Open the app
2. Click on the "BAZA" (Database) tab
3. View sync status, data statistics, and manage your data

### Available Actions

- **Force Sync**: Manually sync pending changes
- **Export Data**: Download your data as JSON
- **Clear Local Data**: Reset local storage (use with caution)
- **View Statistics**: See total days, points, and last activity

## 🔄 Sync Status Indicators

- 🟢 **Online & Synced**: All data is synchronized
- 🟡 **Pending Sync**: Changes waiting to be synced
- 🔴 **Offline**: No internet connection, data stored locally

## 🛠️ Troubleshooting

### Common Issues

1. **Sync Not Working**:
   - Check your internet connection
   - Verify Firebase configuration
   - Check browser console for errors

2. **Data Not Appearing on Other Devices**:
   - Ensure both devices are online
   - Try force sync on both devices
   - Check Firebase console for data

3. **Local Data Issues**:
   - Clear browser cache and IndexedDB
   - Check browser storage permissions
   - Try incognito mode

### Debug Mode

Enable debug logging by opening browser console and looking for:
- Database initialization messages
- Sync status updates
- Error messages

## 🔒 Privacy & Security

- **Local First**: Your data is always stored locally
- **Encrypted Sync**: Data is encrypted in transit to Firebase
- **No Personal Data**: Only task completion and points are synced
- **User Control**: You can clear local data at any time

## 📈 Performance

- **Fast Loading**: IndexedDB provides instant access to data
- **Efficient Sync**: Only changed data is synchronized
- **Offline Support**: Full functionality without internet
- **Background Sync**: Automatic synchronization when online

## 🆘 Support

If you encounter issues:

1. Check the browser console for errors
2. Verify your Firebase configuration
3. Try clearing local data and re-syncing
4. Check your internet connection
5. Ensure Firebase project is properly set up

## 🎯 Next Steps

1. Set up your Firebase project
2. Configure environment variables
3. Test the sync functionality
4. Enjoy seamless data across all your devices!

---

**Note**: This system is designed to work offline-first, so your data is always available even without internet connection. Synchronization happens automatically when you're online.
