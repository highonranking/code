export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  try {
    console.log('=== FIREBASE ENV VAR CHECK ===');
    console.log('FIREBASE_PROJECT_ID:', process.env.FIREBASE_PROJECT_ID ? '✓ SET' : '✗ MISSING');
    console.log('FIREBASE_CLIENT_EMAIL:', process.env.FIREBASE_CLIENT_EMAIL ? '✓ SET' : '✗ MISSING');
    console.log('FIREBASE_PRIVATE_KEY:', process.env.FIREBASE_PRIVATE_KEY ? `✓ SET (${process.env.FIREBASE_PRIVATE_KEY.length} chars)` : '✗ MISSING');
    console.log('FIREBASE_PRIVATE_KEY raw first 100:', process.env.FIREBASE_PRIVATE_KEY?.substring(0, 100));
    console.log('FIREBASE_DATABASE_URL:', process.env.FIREBASE_DATABASE_URL ? '✓ SET' : '✗ MISSING');

    // Parse the key to see if it's valid
    if (process.env.FIREBASE_PRIVATE_KEY) {
      const keyWithNewlines = process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n');
      console.log('Key after newline replacement:', keyWithNewlines.substring(0, 100));
    }

    return res.json({
      timestamp: new Date().toISOString(),
      vars: {
        project_id: process.env.FIREBASE_PROJECT_ID ? '✓' : '✗',
        client_email: process.env.FIREBASE_CLIENT_EMAIL ? '✓' : '✗',
        private_key: process.env.FIREBASE_PRIVATE_KEY ? `✓ (${process.env.FIREBASE_PRIVATE_KEY.length} chars)` : '✗',
        database_url: process.env.FIREBASE_DATABASE_URL ? '✓' : '✗',
      }
    });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
}
