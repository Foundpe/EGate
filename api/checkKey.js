import { getKeys } from "../utils/github.js";

export default async function handler(req, res) {
  if (req.method !== "GET")
    return res.status(405).send("method not allowed");

  const { key } = req.query;

  if (!key) return res.status(400).send("missing key");

  try {
    const { content: keys } = await getKeys();

    const keyData = keys[key];
    if (!keyData) return res.status(404).send("key not found");

    // Return key status and email info (without sensitive data)
    const response = {
      exists: true,
      hasEmail: !!keyData.email,
      email: keyData.email || null,
      hasHwid: !!keyData.hwid,
      created: keyData.created,
      emailBoundAt: keyData.email_bound_at || null
    };

    res.status(200).json(response);
  } catch (e) {
    res.status(500).send("Server error: " + e.message);
  }
}
