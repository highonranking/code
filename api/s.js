// Using Firebase REST API - no SDK needed

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

  const databaseUrl = process.env.FIREBASE_DATABASE_URL;
  if (!databaseUrl) {
    return res.status(500).json({ error: 'Firebase database URL not configured' });
  }

  let shareName = req.query.shareName;

  if (!shareName) {
    return res.status(400).json({ error: 'Share name is required' });
  }

  try {
    // GET - Retrieve shared project from Firebase REST API
    if (req.method === 'GET') {
      const firebaseUrl = `${databaseUrl}/shared_projects/${shareName}.json`;
      console.log(`[GET] Retrieving from: ${shareName}`);

      const response = await fetch(firebaseUrl, { signal: AbortSignal.timeout(5000) });

      if (!response.ok) {
        return res.status(404).json({ error: 'Project not found' });
      }

      const project = await response.json();

      if (!project) {
        return res.status(404).json({ error: 'Project not found' });
      }

      return res.json(project);
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('API Error:', error.message);
    if (error.name === 'AbortError') {
      return res.status(504).json({ error: 'Request timeout' });
    }
    return res.status(500).json({ error: 'Internal server error', message: error.message });
  }
}
