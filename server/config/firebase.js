const admin = require('firebase-admin');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

let serviceAccount;

try {
    // Try to load from a file if it exists
    serviceAccount = require('./serviceAccountKey.json');
} catch (e) {
    // If file doesn't exist, check individual env vars (useful for production/railway/render)
    if (process.env.FIREBASE_PRIVATE_KEY) {
        serviceAccount = {
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        };
    }
}

if (!serviceAccount) {
    console.error("⚠️  FIREBASE WARNING: No serviceAccountKey.json found and no ENV variables set.");
    console.error("⚠️  Database features will fail. Please add serviceAccountKey.json to server/config/");
} else {
    try {
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });
        console.log("🔥 Firebase Admin Initialized Successfully");
    } catch (error) {
        console.error("❌ Firebase Initialization Error:", error.message);
    }
}

const db = admin.apps.length ? admin.firestore() : null;

module.exports = { db, admin };
