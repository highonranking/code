import admin from 'firebase-admin';

// Initialize Firebase Admin
let db = null;

export function initializeFirebase() {
  if (db) return db;

  // Get credentials from environment variables
  const serviceAccount = {
    type: process.env.FIREBASE_TYPE,
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
    private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    client_id: process.env.FIREBASE_CLIENT_ID,
    auth_uri: process.env.FIREBASE_AUTH_URI,
    token_uri: process.env.FIREBASE_TOKEN_URI,
    auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
    client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
    universe_domain: process.env.FIREBASE_UNIVERSE_DOMAIN,
  };

  const databaseURL = process.env.FIREBASE_DATABASE_URL;

  try {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL,
    });

    db = admin.database();
    console.log('Firebase initialized successfully');
    return db;
  } catch (error) {
    console.error('Firebase initialization error:', error);
    throw error;
  }
}

export async function getSharedProject(shareName) {
  try {
    const db = initializeFirebase();
    const snapshot = await db.ref(`shared_projects/${shareName}`).get();
    return snapshot.val();
  } catch (error) {
    console.error('Error getting project:', error);
    return null;
  }
}

export async function setSharedProject(shareName, project) {
  try {
    const db = initializeFirebase();
    await db.ref(`shared_projects/${shareName}`).set(project);
    return true;
  } catch (error) {
    console.error('Error saving project:', error);
    return false;
  }
}

export async function projectExists(shareName) {
  try {
    const project = await getSharedProject(shareName);
    return !!project;
  } catch (error) {
    console.error('Error checking project:', error);
    return false;
  }
}

export async function deleteSharedProject(shareName) {
  try {
    const db = initializeFirebase();
    await db.ref(`shared_projects/${shareName}`).remove();
    return true;
  } catch (error) {
    console.error('Error deleting project:', error);
    return false;
  }
}
