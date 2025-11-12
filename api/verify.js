import { getKeys, updateKeys } from "../utils/github.js";

function isExpired(expires) {
  return expires && new Date(expires) < new Date();
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

    // 🔒 Verificar expiración
    if (isExpired(keyData.expires)) {
      return res.status(403).send("key expired");
    }

    // ⚙️ Si la key es sin HWID, se acepta en cualquier PC
    if (keyData.no_hwid === true) {
      return res.status(200).send("key verified (no hwid)");
    }

    // 🔗 Vincular HWID si aún no lo tiene
    if (!keyData.hwid) {
      keys[key].hwid = hwid;
      await updateKeys(keys, sha);
      return res.status(200).send("key bound to hwid");
    }

    // ⚠️ HWID incorrecto
    if (keyData.hwid !== hwid) {
      return res.status(403).send("hwid mismatch");
    }

    // ✅ Key válida y HWID correcto
    res.status(200).send("key verified");
  } catch (e) {
    res.status(500).send("Server error: " + e.message);
  }
}
