import cors from 'cors';

// Store shared projects in memory
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
  try {
    await runCors(req, res);
  } catch (err) {
    console.error('CORS error:', err);
  }

  const { shareName } = req.query;
  const method = req.method;

  try {
    // Share a project
    if (method === 'POST') {
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

    // Get shared project
    if (method === 'GET') {
      const project = sharedProjects.get(shareName);

      if (!project) {
        return res.status(404).json({ error: 'Project not found. Check the share name.' });
      }

      return res.json(project);
    }

    // Delete shared project
    if (method === 'DELETE') {
      if (!sharedProjects.has(shareName)) {
        return res.status(404).json({ error: 'Shared project not found' });
      }

      sharedProjects.delete(shareName);

      return res.json({
        success: true,
        message: `Project '${shareName}' has been unshared`,
      });
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
