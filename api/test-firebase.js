import { initializeFirebase } from './firebase-config.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  try {
    console.log('Testing Firebase initialization...');
    console.log('FIREBASE_PROJECT_ID:', process.env.FIREBASE_PROJECT_ID ? 'SET' : 'MISSING');
    console.log('FIREBASE_CLIENT_EMAIL:', process.env.FIREBASE_CLIENT_EMAIL ? 'SET' : 'MISSING');
    console.log('FIREBASE_PRIVATE_KEY:', process.env.FIREBASE_PRIVATE_KEY ? 'SET' : 'MISSING');
    console.log('FIREBASE_DATABASE_URL:', process.env.FIREBASE_DATABASE_URL ? 'SET' : 'MISSING');

    const db = initializeFirebase();
    console.log('Firebase initialized successfully');

    // Try a simple read
    const snapshot = await db.ref('shared_projects').limitToFirst(1).get();
    console.log('Firebase read successful');

    return res.json({
      success: true,
      message: 'Firebase is working!',
      projectId: process.env.FIREBASE_PROJECT_ID,
    });
  } catch (error) {
    console.error('Test failed:', error);
    return res.status(500).json({
      success: false,
      error: error.message,
      stack: error.stack,
    });
  }
}
