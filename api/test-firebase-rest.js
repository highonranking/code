export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const databaseUrl = process.env.FIREBASE_DATABASE_URL;

  if (!projectId || !databaseUrl) {
    return res.status(400).json({ error: 'Missing Firebase config' });
  }

  try {
    console.log('[1] Testing Firebase REST API...');
    console.log('[2] Database URL:', databaseUrl);

    // Firebase REST API endpoint
    const restUrl = `${databaseUrl}/shared_projects.json?limitToFirst=1`;
    console.log('[3] Making HTTP request to:', restUrl);

    const startFetch = Date.now();
    const response = await fetch(restUrl, {
      method: 'GET',
      timeout: 5000,
    });
    const fetchTime = Date.now() - startFetch;

    console.log('[4] Response status:', response.status, `(${fetchTime}ms)`);

    if (!response.ok) {
      const text = await response.text();
      console.log('[5] Error response:', text);
      return res.status(response.status).json({
        error: `Firebase API returned ${response.status}`,
        detail: text,
        fetchTime: `${fetchTime}ms`,
      });
    }

    const data = await response.json();
    console.log('[5] Success! Data received:', typeof data);

    return res.json({
      success: true,
      message: 'Firebase REST API is working!',
      projectId,
      dataType: typeof data,
      hasData: !!data,
      fetchTime: `${fetchTime}ms`,
    });
  } catch (error) {
    console.error('[ERROR]', error.message);
    return res.status(500).json({
      success: false,
      error: error.message,
      hint: 'REST API might work better than SDK - try this approach',
    });
  }
}
