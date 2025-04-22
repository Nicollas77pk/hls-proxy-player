const fetch = require('node-fetch');

module.exports = async (req, res) => {
  const targetUrl = req.query.url;
  if (!targetUrl) return res.status(400).send("URL não fornecida.");

  try {
    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36'
      }
    });

    const contentType = response.headers.get("content-type") || 'application/vnd.apple.mpegurl';
    const data = await response.text();

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Content-Type", contentType);
    res.status(200).send(data);
  } catch (err) {
    console.error("Erro ao buscar stream:", err);
    res.status(500).send("Erro ao buscar o stream.");
  }
};
