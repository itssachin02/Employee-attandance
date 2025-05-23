// IMPORTANT: Copy these rules to your Firebase Console
// Go to: Firebase Console > Firestore Database > Rules
// Replace the existing rules with these:

/*
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow all authenticated users to read and write to any document
    // This is a permissive rule set for development
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
*/

// Alternative: If the above doesn't work, use these even more permissive rules:
/*
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow all operations for development
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
*/
