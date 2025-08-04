import { v4 as uuidv4 } from "uuid";
import { getKeys, updateKeys } from "../utils/github.js";

export default async function handler(req, res) {
  if (req.method !== "GET")
    return res.status(405).send("method not allowed");

  const admin = req.query.admin;
  if (admin !== process.env.ADMIN_PASSWORD)
    return res.status(403).send("invalid admin password");

  try {
    const { content: keys, sha } = await getKeys();

    let newKey;
    do {
      newKey = uuidv4().toUpperCase();
    } while (keys[newKey]);

    keys[newKey] = {
      hwid: "",
      last_reset: null,
      created: new Date().toISOString(),
    };

    await updateKeys(keys, sha);

    res.status(200).send(newKey);
  } catch (e) {
    res.status(500).send("Server error: " + e.message);
  }
}
