import { v4 as uuidv4 } from "uuid";
import { getKeys, updateKeys } from "../utils/github.js";

export default async function handler(req, res) {
  if (req.method !== "GET")
    return res.status(405).send("method not allowed");

  const admin = req.query.admin;
  if (admin !== process.env.ADMIN_PASSWORD)
    return res.status(403).send("invalid admin password");

  // días de duración
  const days = parseInt(req.query.days || "30");

  // si es una key sin HWID
  const noHwid = req.query.nohwid === "true";

  try {
    const { content: keys, sha } = await getKeys();

    let newKey;
    do {
      newKey = uuidv4().toUpperCase();
    } while (keys[newKey]);

    const now = new Date();
    const expires = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);

    // estructura del objeto de key
    keys[newKey] = {
      hwid: noHwid ? null : "",
      no_hwid: noHwid,
      last_reset: null,
      created: now.toISOString(),
      expires: expires.toISOString(),
      email: "",
    };

    await updateKeys(keys, sha);

    // respuesta clara para mostrar en el panel
    const msg = noHwid
      ? `${newKey} (expira el ${expires.toISOString().split("T")[0]}) [sin HWID]`
      : `${newKey} (expira el ${expires.toISOString().split("T")[0]})`;

    res.status(200).send(msg);
  } catch (e) {
    res.status(500).send("Server error: " + e.message);
  }
}
