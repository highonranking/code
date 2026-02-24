export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  try {
    // Try to write without auth token first
    const databaseUrl = process.env.FIREBASE_DATABASE_URL;
    const testUrl = `${databaseUrl}/test_write.json`;

    console.log('Attempting write to:', testUrl);

    const writeRes = await fetch(testUrl, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ test: 'data', timestamp: Date.now() }),
    });

    console.log('Write response status:', writeRes.status);
    const responseText = await writeRes.text();
    console.log('Write response:', responseText);

    if (writeRes.ok) {
      return res.json({
        success: true,
        message: 'Unauthenticated writes are allowed!',
        response: responseText,
      });
    } else {
      return res.status(writeRes.status).json({
        error: 'Write failed',
        status: writeRes.status,
        response: responseText,
        hint: 'Need to update Firebase Realtime Database rules to allow unauthenticated writes, or use an API key',
      });
    }
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({
      error: error.message,
    });
  }
}
