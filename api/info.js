import { getKeys } from '../utils/github.js';

export default async function handler(req, res) {
  const { key, admin } = req.query;

  // Validar contraseña de admin
  if (admin !== process.env.ADMIN_PASSWORD) {
    return res.status(403).send("❌ Forbidden");
  }

  try {
    // Obtener todas las keys desde GitHub
    const { content } = await getKeys();

    // El archivo user.txt se interpreta como texto plano
    // Ejemplo de línea: E290B059-AAC5-41D6-A269-94742EE4C59B | 2025-11-23 | user@mail.com | HWID123
    const lines = content.split('\n').map(l => l.trim()).filter(Boolean);

    // Buscar la key específica
    const entry = lines.find(line => line.startsWith(key));
    if (!entry) return res.status(404).send("❌ Key not found");

    // Separar los datos
    const [license, expiry, email, hwid] = entry.split('|').map(v => v?.trim() || '');

    // Devolver info formateada
    return res.json({
      key: license,
      expiry: expiry || 'N/A',
      email: email || 'Not bound',
      hwid: hwid || 'N/A'
    });

  } catch (err) {
    console.error("Error in /info:", err);
    res.status(500).send("❌ Server error");
  }
}
