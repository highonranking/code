import admin from 'firebase-admin';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  const startTime = Date.now();

  try {
    console.log('[1] Starting Firebase test...');

    // Step 1: Check env vars
    const envCheck = {
      project_id: !!process.env.FIREBASE_PROJECT_ID,
      client_email: !!process.env.FIREBASE_CLIENT_EMAIL,
      private_key: !!process.env.FIREBASE_PRIVATE_KEY,
      database_url: !!process.env.FIREBASE_DATABASE_URL,
    };
    console.log('[2] Env vars OK:', envCheck);

    // Step 2: Build service account
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
    console.log('[3] Service account built:', serviceAccount.project_id);

    // Step 3: Initialize Firebase
    if (admin.apps.length === 0) {
      console.log('[4] Initializing Firebase Admin...');
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: process.env.FIREBASE_DATABASE_URL,
      });
      console.log('[5] Firebase Admin initialized');
    } else {
      console.log('[4-5] Firebase already initialized');
    }

    // Step 4: Get database reference
    console.log('[6] Getting database reference...');
    const db = admin.database();
    console.log('[7] Database reference obtained');

    // Step 5: Try to connect with timeout
    console.log('[8] Attempting database read (with 5s timeout)...');
    const readPromise = db.ref('shared_projects').limitToFirst(1).get();
    
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Database read timeout after 5s')), 5000)
    );

    const snapshot = await Promise.race([readPromise, timeoutPromise]);
    console.log('[9] Database read successful');

    const elapsed = Date.now() - startTime;
    return res.json({
      success: true,
      message: 'Firebase is working!',
      steps: ['✓ Env vars', '✓ Service account', '✓ Admin init', '✓ DB reference', '✓ DB read'],
      projectId: process.env.FIREBASE_PROJECT_ID,
      elapsed: `${elapsed}ms`,
    });
  } catch (error) {
    const elapsed = Date.now() - startTime;
    console.error('[ERROR]', error.message);
    return res.status(500).json({
      success: false,
      error: error.message,
      elapsed: `${elapsed}ms`,
    });
  }
}
