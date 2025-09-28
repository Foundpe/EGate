import { getKeys, updateKeys } from "../utils/github.js";

export default async function handler(req, res) {
  if (req.method !== "GET")
    return res.status(405).send("method not allowed");

  const { key, email } = req.query;

  if (!key) return res.status(400).send("missing key");
  if (!email) return res.status(400).send("missing email");

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).send("invalid email format");
  }

  try {
    const { content: keys, sha } = await getKeys();

    const keyData = keys[key];
    if (!keyData) return res.status(404).send("key not found");

    // Check if email is already bound to another key
    for (const [existingKey, data] of Object.entries(keys)) {
      if (data.email === email && existingKey !== key) {
        return res.status(409).send("email already bound to another key");
      }
    }

    // Check if key already has an email bound
    if (keyData.email) {
      return res.status(409).send("key already has email bound: " + keyData.email);
    }

    // Bind the email to the key
    keys[key].email = email;
    keys[key].email_bound_at = new Date().toISOString();

    await updateKeys(keys, sha);

    res.status(200).send("email successfully bound to key");
  } catch (e) {
    res.status(500).send("Server error: " + e.message);
  }
}
