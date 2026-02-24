export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  const databaseUrl = process.env.FIREBASE_DATABASE_URL;
  const apiKey = process.env.FIREBASE_API_KEY;

  if (!databaseUrl) {
    return res.status(500).json({ error: 'FIREBASE_DATABASE_URL not configured' });
  }

  // If no API key, try without it (for public read-only)
  const authParam = apiKey ? `?auth=${apiKey}` : '';

  try {
    console.log('Testing write with auth parameter...');
    const testUrl = `${databaseUrl}/test_write${authParam}.json`;

    const writeRes = await fetch(testUrl, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ test: 'data', timestamp: Date.now() }),
    });

    const responseText = await writeRes.text();
    console.log('Status:', writeRes.status, 'Response:', responseText);

    if (writeRes.ok) {
      return res.json({
        success: true,
        message: 'Write successful!',
        note: apiKey ? 'Using API key auth' : 'Using public rules',
      });
    } else {
      return res.status(writeRes.status).json({
        error: 'Write failed',
        status: writeRes.status,
        response: responseText,
        apiKeyConfigured: !!apiKey,
        suggestion: 'Update Firebase Realtime Database rules to allow public writes',
      });
    }
  } catch (error) {
    console.error('Error:', error.message);
    return res.status(500).json({ error: error.message });
  }
}
