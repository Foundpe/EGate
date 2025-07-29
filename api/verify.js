import { getKeys, updateKeys } from "../utils/github.js";

function hoursSince(dateStr) {
  if (!dateStr) return 9999;
  return (Date.now() - new Date(dateStr)) / 1000 / 60 / 60;
}

export default async function handler(req, res) {
  if (req.method !== "GET")
    return res.status(405).send("method not allowed");

  const { key, hwid } = req.query;
  if (!key || !hwid) return res.status(400).send("missing key or hwid");

  try {
    const { content: keys, sha } = await getKeys();

    const keyData = keys[key];
    if (!keyData) return res.status(404).send("key not found");

    if (!keyData.hwid) {
      keys[key].hwid = hwid;
      await updateKeys(keys, sha);
      return res.status(200).send("key bound to hwid");
    }

    if (keyData.hwid !== hwid) {
      return res.status(403).send("hwid mismatch");
    }

    res.status(200).send("key verified");
  } catch (e) {
    res.status(500).send("Server error: " + e.message);
  }
}
