export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  const apiKey = process.env.FIREBASE_API_KEY;
  const projectId = process.env.FIREBASE_PROJECT_ID;

  if (!apiKey) {
    return res.status(500).json({ 
      error: 'FIREBASE_API_KEY not configured in environment',
      hint: 'Add FIREBASE_API_KEY to Vercel environment variables from Firebase console'
    });
  }

  try {
    console.log('Testing Firebase with API key auth...');
    
    // Firebase REST API with auth parameter
    const url = `https://${projectId}.firebaseio.com/test_write.json?auth=${apiKey}`;
    console.log('URL:', url.replace(apiKey, '[REDACTED]'));

    const writeRes = await fetch(url, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ test: 'data', timestamp: Date.now() }),
      signal: AbortSignal.timeout(5000),
    });

    console.log('Status:', writeRes.status);
    const responseText = await writeRes.text();
    console.log('Response:', responseText);

    if (writeRes.ok) {
      return res.json({
        success: true,
        message: 'Write successful with API key!',
        response: responseText,
      });
    } else {
      return res.status(writeRes.status).json({
        error: 'Write failed',
        status: writeRes.status,
        response: responseText,
      });
    }
  } catch (error) {
    console.error('Error:', error.message);
    return res.status(500).json({
      error: error.message,
    });
  }
}
