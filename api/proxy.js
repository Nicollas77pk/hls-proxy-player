const fetch = require('node-fetch');

module.exports = async (req, res) => {
  const targetUrl = req.query.url;
  if (!targetUrl) return res.status(400).send("URL não fornecida.");

  try {
    const response = await fetch(targetUrl);
    const contentType = response.headers.get("content-type") || "application/vnd.apple.mpegurl";
    const text = await response.text();

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "*");
    res.setHeader("Content-Type", contentType);

    res.status(200).send(text);
  } catch (err) {
    console.error("Erro ao buscar o stream:", err);
    res.status(500).send("Erro ao buscar o stream.");
  }
};
