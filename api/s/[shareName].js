// This is a shared store across all requests
// In production, you'd use a database
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

  const { shareName } = req.query;

  // GET - retrieve shared project
  if (req.method === 'GET') {
    const project = sharedProjects[shareName];

    if (!project) {
      return res.status(404).json({ error: 'Project not found. Check the share name.' });
    }

    return res.json(project);
  }

  res.status(405).json({ error: 'Method not allowed' });
}
