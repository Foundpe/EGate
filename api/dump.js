import { getFileFromGitHub } from '../utils/github.js';

export default async function handler(req, res) {
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
  const admin = req.query.admin;

  if (!admin || admin !== ADMIN_PASSWORD) {
    return res.status(403).json({ error: "Forbidden" });
  }

  try {
    const { content } = await getFileFromGitHub("keys.json");
    res.status(200).json(content);
  } catch (err) {
    console.error("Error fetching keys:", err);
    res.status(500).json({ error: "Failed to fetch keys.json" });
  }
}
