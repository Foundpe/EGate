import { getKeys, updateKeys } from '../utils/github.js';

export default async function handler(req, res) {
  const { key, admin } = req.query;
  if (admin !== process.env.ADMIN_PASSWORD) {
    return res.status(403).send("Forbidden");
  }

  try {
    const { content: keys, sha } = await getKeys();
    if (!keys[key]) return res.status(404).send("Key not found");

    delete keys[key];
    await updateKeys(keys, sha);
    res.send("Key deleted");
  } catch (err) {
    res.status(500).send("Server error");
  }
}
