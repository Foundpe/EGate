import { getKeys, updateKeys } from "../utils/github.js";

export default async function handler(req, res) {
  if (req.method !== "GET")
    return res.status(405).send("method not allowed");

  const { key, admin } = req.query;
  
  // Check admin authentication
  if (admin !== process.env.ADMIN_PASSWORD) {
    return res.status(403).send("Forbidden");
  }

  if (!key) return res.status(400).send("missing key");

  try {
    const { content: keys, sha } = await getKeys();

    const keyData = keys[key];
    if (!keyData) return res.status(404).send("key not found");

    // Admin reset - no cooldown check
    keys[key].hwid = "";
    keys[key].last_reset = new Date().toISOString();

    await updateKeys(keys, sha);

    res.status(200).send("admin hwid reset successful");
  } catch (e) {
    res.status(500).send("Server error: " + e.message);
  }
}
