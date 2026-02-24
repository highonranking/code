import admin from 'firebase-admin';

let db = null;

function initializeFirebase() {
  if (db) return db;

  try {
    let privateKey = (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n');
    
    // Ensure the key ends properly
    if (!privateKey.endsWith('-----END PRIVATE KEY-----')) {
      if (!privateKey.endsWith('\n')) {
        privateKey += '\n';
      }
      privateKey += '-----END PRIVATE KEY-----';
    }

    const serviceAccount = {
      type: 'service_account',
      project_id: process.env.FIREBASE_PROJECT_ID,
      private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
      private_key: privateKey,
      client_email: process.env.FIREBASE_CLIENT_EMAIL,
      client_id: process.env.FIREBASE_CLIENT_ID,
      auth_uri: 'https://accounts.google.com/o/oauth2/auth',
      token_uri: 'https://oauth2.googleapis.com/token',
      auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
      client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
    };

    if (admin.apps.length === 0) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: process.env.FIREBASE_DATABASE_URL,
      });
    }

    db = admin.database();
    return db;
  } catch (error) {
    console.error('[Firebase] Init error:', error.message);
    throw error;
  }
}

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  let shareName = req.query.shareName;

  if (!shareName) {
    return res.status(400).json({ error: 'Share name is required' });
  }

  try {
    // GET - Retrieve shared project from Firebase
    if (req.method === 'GET') {
      const database = initializeFirebase();
      console.log(`[GET] Retrieving project: ${shareName}`);

      const snapshot = await database.ref(`shared_projects/${shareName}`).get();

      if (!snapshot.exists()) {
        return res.status(404).json({ error: 'Project not found' });
      }

      return res.json(snapshot.val());
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal server error', message: error.message });
  }
}
