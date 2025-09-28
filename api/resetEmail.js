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

    // Check if key has an email to reset
    if (!keyData.email) {
      return res.status(400).send("key has no email bound");
    }

    // Reset the email
    keys[key].email = "";
    keys[key].email_reset_at = new Date().toISOString();
    // Remove email_bound_at timestamp since email is no longer bound
    delete keys[key].email_bound_at;

    await updateKeys(keys, sha);

    res.status(200).send("email reset successfully");
  } catch (e) {
    res.status(500).send("Server error: " + e.message);
  }
}
