// api/dump.js
import { getKeys } from '../utils/github.js';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

export default async function handler(req, res) {
  const { admin } = req.query;

  if (admin !== ADMIN_PASSWORD) {
    return res.status(403).json({ error: 'Forbidden – Invalid admin password' });
  }

  try {
    const { content: keys } = await getKeys();
    res.status(200).json({ keys });
  } catch (err) {
    console.error('Error fetching keys.json:', err);
    res.status(500).json({ error: 'Failed to fetch keys.json', details: err.message });
  }
}
