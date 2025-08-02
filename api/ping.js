export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).send("method not allowed");
  }

  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
}
