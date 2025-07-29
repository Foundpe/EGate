import { getKeys, updateKeys } from "../utils/github.js";

function hoursSince(dateStr) {
  if (!dateStr) return 9999;
  return (Date.now() - new Date(dateStr)) / 1000 / 60 / 60;
}

export default async function handler(req, res) {
  if (req.method !== "GET")
    return res.status(405).send("method not allowed");

  const { key } = req.query;
  if (!key) return res.status(400).send("missing key");

  try {
    const { content: keys, sha } = await getKeys();

    const keyData = keys[key];
    if (!keyData) return res.status(404).send("key not found");

    if (hoursSince(keyData.last_reset) < 24) {
      const timeLeft = (24 - hoursSince(keyData.last_reset)).toFixed(1);
      return res.status(429).send(`cooldown: try again in ${timeLeft} hours`);
    }

    keys[key].hwid = "";
    keys[key].last_reset = new Date().toISOString();

    await updateKeys(keys, sha);

    res.status(200).send("hwid reset");
  } catch (e) {
    res.status(500).send("Server error: " + e.message);
  }
}
