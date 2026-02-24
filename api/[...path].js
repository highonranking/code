// Store shared projects globally
let sharedProjects = {};

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Parse the path: /api/share/... or /api/s/...
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname;
  
  // Match /api/share/:shareName
  const shareMatch = pathname.match(/^\/api\/share\/([a-zA-Z0-9_-]+)$/);
  if (shareMatch) {
    const shareName = shareMatch[1];
    
    if (req.method === 'POST') {
      const { project } = req.body;

      if (!project) {
        return res.status(400).json({ error: 'Missing project data' });
      }

      if (!shareName || shareName.length < 2) {
        return res.status(400).json({ error: 'Share name must be at least 2 characters' });
      }

      // Validate share name
      if (!/^[a-zA-Z0-9_-]+$/.test(shareName)) {
        return res.status(400).json({ error: 'Share name can only contain letters, numbers, underscores, and hyphens' });
      }

      // Check if name already exists
      if (sharedProjects[shareName]) {
        return res.status(409).json({ error: 'This share name is already taken' });
      }

      // Store the project
      sharedProjects[shareName] = {
        ...project,
        shareName,
        sharedAt: Date.now(),
      };

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

    if (req.method === 'GET') {
      const project = sharedProjects[shareName];

      if (!project) {
        return res.status(404).json({ error: 'Project not found' });
      }

      return res.json(project);
    }

    if (req.method === 'DELETE') {
      if (!sharedProjects[shareName]) {
        return res.status(404).json({ error: 'Shared project not found' });
      }

      delete sharedProjects[shareName];

      return res.json({
        success: true,
        message: `Project '${shareName}' has been unshared`,
      });
    }
  }

  // Match /api/s/:shareName
  const sMatch = pathname.match(/^\/api\/s\/([a-zA-Z0-9_-]+)$/);
  if (sMatch) {
    const shareName = sMatch[1];

    if (req.method === 'GET') {
      const project = sharedProjects[shareName];

      if (!project) {
        return res.status(404).json({ error: 'Project not found' });
      }

      return res.json(project);
    }
  }

  // List shares
  if (pathname === '/api/shares' && req.method === 'GET') {
    const shares = Object.keys(sharedProjects).map(name => ({
      name,
      url: `/s/${name}`,
    }));

    return res.json({ shares, count: shares.length });
  }

  res.status(404).json({ error: 'Not found' });
}
