import { getKeys } from "../utils/github.js";

export default async function handler(req, res) {
  const { key, admin } = req.query;

  if (admin !== process.env.ADMIN_PASSWORD) {
    return res.status(403).json({ error: "Forbidden" });
  }

  try {
    const { content: keys } = await getKeys();
    const data = keys[key];

    if (!data) {
      return res.status(404).json({ error: "Key not found" });
    }

    // ✅ Si todo está bien, devuelve JSON válido
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err.message });
  }
}
