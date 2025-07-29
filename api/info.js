import { getKeys } from '../utils/github.js';

export default async function handler(req, res) {
  const { key, admin } = req.query;
  if (admin !== process.env.ADMIN_PASSWORD) {
    return res.status(403).send("Forbidden");
  }

  try {
    const { content: keys } = await getKeys();
    const data = keys[key];
    if (!data) return res.status(404).send("Key not found");
    res.json(data);
  } catch (err) {
    res.status(500).send("Server error");
  }
}
