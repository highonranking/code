import admin from 'firebase-admin';

let db = null;

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  try {
    console.log('[1] Initializing Firebase Admin SDK...');

    // Only initialize once
    if (!db) {
      const serviceAccount = {
        type: 'service_account',
        project_id: process.env.FIREBASE_PROJECT_ID,
        private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
        private_key: (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
        client_email: process.env.FIREBASE_CLIENT_EMAIL,
        client_id: process.env.FIREBASE_CLIENT_ID,
        auth_uri: 'https://accounts.google.com/o/oauth2/auth',
        token_uri: 'https://oauth2.googleapis.com/token',
        auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
        client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
      };

      // Use existing app if available
      if (admin.apps.length > 0) {
        db = admin.app().database();
      } else {
        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
          databaseURL: process.env.FIREBASE_DATABASE_URL,
        });
        db = admin.database();
      }
    }

    console.log('[2] Firebase initialized');

    // Simple write test
    const testData = { test: 'data', timestamp: Date.now() };
    console.log('[3] Writing test data...');
    
    await db.ref('test_write').set(testData);
    console.log('[4] Write successful!');

    return res.json({
      success: true,
      message: 'Firebase SDK write successful!',
      data: testData,
    });
  } catch (error) {
    console.error('[ERROR]', error.message, error.stack);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}
