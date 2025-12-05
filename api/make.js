import { getKeys, updateKeys } from "../utils/github.js";

// Función auxiliar para generar caracteres aleatorios sobre la máscara
function generateCustomKey(pattern) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  // Reemplaza cada '*' con un caracter aleatorio
  return pattern.replace(/\*/g, () => chars[Math.floor(Math.random() * chars.length)]);
}

export default async function handler(req, res) {
  if (req.method !== "GET")
    return res.status(405).send("Method not allowed");

  const admin = req.query.admin;
  if (admin !== process.env.ADMIN_PASSWORD)
    return res.status(403).send("Invalid admin password");

  // --- PARÁMETROS NUEVOS ---
  // Recibimos amount (cantidad) y unit (minutos, horas, dias, etc)
  const amount = parseInt(req.query.amount || "30");
  const unit = req.query.unit || "days"; 
  
  // Recibimos si es free (no hwid)
  const noHwid = req.query.nohwid === "true";

  // Recibimos el patrón custom. Si no envían nada, usamos defaults.
  let patternInput = req.query.pattern || "MINHOOK-******";
  
  // --- REGLA OBLIGATORIA: FREE KEYS ---
  // Si es free, forzamos el formato MINHOOKFREE
  if (noHwid) {
    patternInput = "MINHOOKFREE-****";
  }

  // --- CÁLCULO DE TIEMPO ---
  const now = new Date();
  let expiresDate = new Date(now);

  // Multiplicadores en milisegundos
  const timeMap = {
    minutes: 60 * 1000,
    hours: 60 * 60 * 1000,
    days: 24 * 60 * 60 * 1000,
    weeks: 7 * 24 * 60 * 60 * 1000,
    months: 30 * 24 * 60 * 60 * 1000, // aprox
    years: 365 * 24 * 60 * 60 * 1000
  };

  // Si es Lifetime, ponemos una fecha muy lejana (Año 2099)
  if (unit === 'lifetime') {
    expiresDate.setFullYear(2099, 0, 1);
  } else {
    // Si la unidad existe en el mapa, sumamos el tiempo
    const multiplier = timeMap[unit] || timeMap['days'];
    expiresDate = new Date(now.getTime() + (amount * multiplier));
  }

  try {
    const { content: keys, sha } = await getKeys();

    let newKey;
    let attempts = 0;
    
    // Generar Key y asegurar que no exista duplicada
    do {
      newKey = generateCustomKey(patternInput);
      attempts++;
      // Safety break por si alguien pone un patrón sin asteriscos "HOLA"
      if(attempts > 10) break; 
    } while (keys[newKey]);

    // Guardar en la estructura de datos
    keys[newKey] = {
      hwid: noHwid ? null : "",
      no_hwid: noHwid,
      last_reset: null,
      created: now.toISOString(),
      expires: expiresDate.toISOString(),
      email: "",
      // Opcional: Guardamos info extra del plan para mostrarlo en dashboard
      plan_info: unit === 'lifetime' ? 'Lifetime' : `${amount} ${unit}`
    };

    await updateKeys(keys, sha);

    // Respuesta simple para el frontend
    // Formato: KEY (expira el YYYY-MM-DD)
    const friendlyDate = expiresDate.toISOString().replace("T", " ").substring(0, 16); // "2025-10-10 15:30"
    const msg = unit === 'lifetime' 
      ? `${newKey} (Lifetime)` 
      : `${newKey} (Expires: ${friendlyDate})`;

    res.status(200).send(msg);

  } catch (e) {
    res.status(500).send("Server error: " + e.message);
  }
}
