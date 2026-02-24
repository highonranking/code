import express from 'express';
import type { Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import os from 'os';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Only serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../dist')));
}

// Store shared projects in memory (in production, use a database)
const sharedProjects = new Map();

// Endpoints

// Share a project with a simple name (e.g., /share/abhinav)
app.post('/api/share/:shareName', (req: Request, res: Response) => {
  const { shareName } = req.params;
  const { project } = req.body;

  if (!project) {
    return res.status(400).json({ error: 'Missing project data' });
  }

  if (!shareName || shareName.length < 2) {
    return res.status(400).json({ error: 'Share name must be at least 2 characters' });
  }

  // Validate share name (alphanumeric and hyphens only)
  const shareNameStr = Array.isArray(shareName) ? shareName[0] : shareName;
  if (!/^[a-zA-Z0-9_-]+$/.test(shareNameStr)) {
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

  const shareUrl = `${req.protocol}://${req.get('host')}/s/${shareName}`;

  res.json({
    success: true,
    shareUrl,
    shareName,
    message: `Share your code at: ${shareUrl}`,
  });
});

// Get shared project by simple name
app.get('/api/s/:shareName', (req: Request, res: Response) => {
  const { shareName } = req.params;
  const project = sharedProjects.get(shareName);

  if (!project) {
    return res.status(404).json({ error: 'Project not found. Check the share name.' });
  }

  res.json(project);
});

// List all shared projects (optional endpoint for discovery)
app.get('/api/shares', (_req: Request, res: Response) => {
  const shares = Array.from(sharedProjects.keys()).map(name => ({
    name,
    url: `/s/${name}`,
  }));

  res.json({ shares, count: shares.length });
});

// Delete/Unshare a project
app.delete('/api/s/:shareName', (req: Request, res: Response) => {
  const { shareName } = req.params;

  if (!sharedProjects.has(shareName)) {
    return res.status(404).json({ error: 'Shared project not found' });
  }

  sharedProjects.delete(shareName);

  res.json({
    success: true,
    message: `Project '${shareName}' has been unshared`,
  });
});

// Simple redirect route for /share/name -> /s/name
app.get('/share/:shareName', (req: Request, res: Response) => {
  const { shareName } = req.params;
  res.redirect(`/s/${shareName}`);
});

// Serve the React app for any other route (production only)
if (process.env.NODE_ENV === 'production') {
  app.get('*', (_req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(`Local network: http://${getLocalIP()}:${PORT}`);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

function getLocalIP(): string {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    const iface = interfaces[name];
    if (iface) {
      for (const addr of iface) {
        if (addr.family === 'IPv4' && !addr.internal) {
          return addr.address;
        }
      }
    }
  }
  return 'localhost';
}
