import cors from 'cors';

// Store shared projects in memory (will reset on deploy, use database for persistence)
const sharedProjects = new Map();

const corsMiddleware = cors();

function runCors(req, res) {
  return new Promise((resolve, reject) => {
    corsMiddleware(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

export default async function handler(req, res) {
  // Enable CORS
  await runCors(req, res);

  const { pathname } = new URL(req.url, `http://${req.headers.host}`);
  const method = req.method;

  // Share a project with a simple name
  if (method === 'POST' && pathname.startsWith('/api/share/')) {
    const shareName = pathname.replace('/api/share/', '');
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
    if (sharedProjects.has(shareName)) {
      return res.status(409).json({ error: 'This share name is already taken' });
    }

    // Store the project
    sharedProjects.set(shareName, {
      ...project,
      shareName,
      sharedAt: Date.now(),
    });

    // Build share URL
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

  // Get shared project data
  if (method === 'GET' && pathname.startsWith('/api/s/')) {
    const shareName = pathname.replace('/api/s/', '');
    const project = sharedProjects.get(shareName);

    if (!project) {
      return res.status(404).json({ error: 'Project not found. Check the share name.' });
    }

    return res.json(project);
  }

  // List all shared projects
  if (method === 'GET' && pathname === '/api/shares') {
    const shares = Array.from(sharedProjects.keys()).map(name => ({
      name,
      url: `/s/${name}`,
    }));

    return res.json({ shares, count: shares.length });
  }

  // Delete/Unshare a project
  if (method === 'DELETE' && pathname.startsWith('/api/s/')) {
    const shareName = pathname.replace('/api/s/', '');

    if (!sharedProjects.has(shareName)) {
      return res.status(404).json({ error: 'Shared project not found' });
    }

    sharedProjects.delete(shareName);

    return res.json({
      success: true,
      message: `Project '${shareName}' has been unshared`,
    });
  }

  // Redirect /share/:name to /s/:name
  if (method === 'GET' && pathname.startsWith('/share/')) {
    const shareName = pathname.replace('/share/', '');
    const protocol = req.headers['x-forwarded-proto'] || 'https';
    const host = req.headers['x-forwarded-host'] || req.headers.host;
    return res.redirect(307, `${protocol}://${host}/s/${shareName}`);
  }

  res.status(404).json({ error: 'Not Found' });
}
