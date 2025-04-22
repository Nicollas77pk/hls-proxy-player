const fetch = require('node-fetch');

module.exports = async (req, res) => {
  const targetUrl = req.query.url;
  if (!targetUrl) return res.status(400).send("URL não fornecida.");

  try {
    const response = await fetch(targetUrl);
    const contentType = response.headers.get("content-type") || "application/vnd.apple.mpegurl";
    const buffer = await response.buffer(); // Usa buffer ao invés de text()

    res.setHeader("Content-Type", contentType);
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.status(200).send(buffer); // Retorna como buffer
  } catch (err) {
    console.error("Erro ao buscar o stream:", err);
    res.status(500).send("Erro ao buscar o stream.");
  }
};
