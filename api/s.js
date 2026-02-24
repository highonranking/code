// This will share the same sharedProjects store
// Note: In a real app, you'd use a database

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

  let shareName = req.query.shareName;

  if (!shareName) {
    return res.status(400).json({ error: 'Share name is required' });
  }

  try {
    // For now, just return not found - share.js handles the actual logic
    // In production, you'd fetch from a database
    return res.status(404).json({ error: 'Project not found' });
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
