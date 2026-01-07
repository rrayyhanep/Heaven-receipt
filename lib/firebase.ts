
import admin from 'firebase-admin';

// Check if the service account JSON is provided in the environment variables.
if (!process.env.FIREBASE_SERVICE_ACCOUNT) {
  throw new Error('The FIREBASE_SERVICE_ACCOUNT environment variable is not set.');
}

// To prevent re-initializing the app on every API call in a serverless environment,
// we check if the app is already initialized.
if (!admin.apps.length) {
  try {
    // Parse the service account credentials from the environment variable.
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  } catch (error) {
    console.error('Firebase initialization error:', error);
    // Throw an error to prevent the application from running with a bad configuration.
    throw new Error('Failed to initialize Firebase. Please check the FIREBASE_SERVICE_ACCOUNT environment variable.');
  }
}

// Export the initialized Firestore database instance for use in our API routes.
const db = admin.firestore();
export { db };
