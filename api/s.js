import { getProject } from './storage.js';

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

  let shareName = req.query.shareName;

  if (!shareName) {
    return res.status(400).json({ error: 'Share name is required' });
  }

  try {
    // GET - Retrieve shared project
    if (req.method === 'GET') {
      const project = getProject(shareName);

      if (!project) {
        return res.status(404).json({ error: 'Project not found' });
      }

      return res.json(project);
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
