import { getSharedProject, setSharedProject, projectExists, deleteSharedProject } from './firebase-config.js';

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

  // Parse shareName from query
  let shareName = req.query.shareName;

  if (!shareName) {
    return res.status(400).json({ error: 'Share name is required' });
  }

  try {
    // POST - Create/share a project
    if (req.method === 'POST') {
      const { project } = req.body;

      if (!project) {
        return res.status(400).json({ error: 'Missing project data' });
      }

      if (shareName.length < 2) {
        return res.status(400).json({ error: 'Share name must be at least 2 characters' });
      }

      // Validate share name
      if (!/^[a-zA-Z0-9_-]+$/.test(shareName)) {
        return res.status(400).json({ error: 'Share name can only contain letters, numbers, underscores, and hyphens' });
      }

      // Check if name already exists
      if (await projectExists(shareName)) {
        return res.status(409).json({ error: 'This share name is already taken' });
      }

      // Store the project in Firebase
      const projectData = {
        ...project,
        shareName,
        sharedAt: Date.now(),
      };

      const saved = await setSharedProject(shareName, projectData);
      if (!saved) {
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
      const project = await getSharedProject(shareName);

      if (!project) {
        return res.status(404).json({ error: 'Project not found' });
      }

      return res.json(project);
    }

    // DELETE - Remove shared project
    if (req.method === 'DELETE') {
      if (!(await projectExists(shareName))) {
        return res.status(404).json({ error: 'Shared project not found' });
      }

      const deleted = await deleteSharedProject(shareName);
      if (!deleted) {
        return res.status(500).json({ error: 'Failed to delete project' });
      }

      return res.json({
        success: true,
        message: `Project '${shareName}' has been unshared`,
      });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal server error', message: error.message });
  }
}