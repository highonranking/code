// Using Firebase REST API - no SDK needed, faster and more reliable

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
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

  // Parse shareName from query
  let shareName = req.query.shareName;

  if (!shareName) {
    return res.status(400).json({ error: 'Share name is required' });
  }

  // Validate share name
  if (!/^[a-zA-Z0-9_-]+$/.test(shareName)) {
    return res.status(400).json({ error: 'Share name can only contain letters, numbers, underscores, and hyphens' });
  }

  try {
    const firebaseUrl = `${databaseUrl}/shared_projects/${shareName}.json`;

    // POST - Create/share a project
    if (req.method === 'POST') {
      const { project } = req.body;

      if (!project) {
        return res.status(400).json({ error: 'Missing project data' });
      }

      if (shareName.length < 2) {
        return res.status(400).json({ error: 'Share name must be at least 2 characters' });
      }

      console.log(`[POST] Saving project: ${shareName}`);

      // Check if it already exists
      const checkRes = await fetch(firebaseUrl, { signal: AbortSignal.timeout(5000) });
      if (checkRes.ok) {
        const existing = await checkRes.json();
        if (existing !== null) {
          return res.status(409).json({ error: 'This share name is already taken' });
        }
      }

      // Save the project
      const projectData = {
        ...project,
        shareName,
        sharedAt: Date.now(),
      };

      const saveRes = await fetch(firebaseUrl, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projectData),
        signal: AbortSignal.timeout(5000),
      });

      if (!saveRes.ok) {
        const errorText = await saveRes.text();
        console.error('Firebase save error:', saveRes.status, errorText);
        return res.status(500).json({ error: 'Failed to save project' });
      }

      const protocol = req.headers['x-forwarded-proto'] || 'https';
      const host = req.headers['x-forwarded-host'] || req.headers.host;
      const shareUrl = `${protocol}://${host}/s/${shareName}`;

      return res.json({
        success: true,
        shareUrl,
        shareName,
        message: `Share your code at: ${shareUrl}`,
      });
    }

    // GET - Retrieve shared project
    if (req.method === 'GET') {
      console.log(`[GET] Retrieving project: ${shareName}`);

      const getRes = await fetch(firebaseUrl, { signal: AbortSignal.timeout(5000) });

      if (!getRes.ok) {
        return res.status(404).json({ error: 'Project not found' });
      }

      const project = await getRes.json();

      if (!project) {
        return res.status(404).json({ error: 'Project not found' });
      }

      return res.json(project);
    }

    // DELETE - Remove shared project
    if (req.method === 'DELETE') {
      console.log(`[DELETE] Removing project: ${shareName}`);

      const deleteRes = await fetch(firebaseUrl, { 
        method: 'DELETE',
        signal: AbortSignal.timeout(5000),
      });

      if (!deleteRes.ok) {
        return res.status(500).json({ error: 'Failed to delete project' });
      }

      return res.json({
        success: true,
        message: `Project '${shareName}' has been unshared`,
      });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('API Error:', error.message);
    if (error.name === 'AbortError') {
      return res.status(504).json({ error: 'Request timeout - Firebase database may be slow' });
    }
    return res.status(500).json({ error: 'Internal server error', message: error.message });
  }
}