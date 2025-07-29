import { getKeys, updateKeys } from '../utils/github.js';

export default async function handler(req, res) {
  const { admin } = req.query;
  if (admin !== process.env.ADMIN_PASSWORD) {
    return res.status(403).send("Forbidden");
  }

  try {
    const { content: keys, sha } = await getKeys();
    await updateKeys({}, sha);
    res.send("All keys deleted");
  } catch (err) {
    res.status(500).send("Server error");
  }
}
