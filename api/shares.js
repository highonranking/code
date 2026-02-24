import cors from 'cors';

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
  try {
    await runCors(req, res);
  } catch (err) {
    console.error('CORS error:', err);
  }

  if (req.method === 'GET') {
    // Return empty array since we're using in-memory storage
    // In production, you'd fetch from a database
    return res.json({ shares: [], count: 0 });
  }

  res.status(405).json({ error: 'Method not allowed' });
}
