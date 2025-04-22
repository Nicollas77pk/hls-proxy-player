const fetch = require('node-fetch');

module.exports = async (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).send("URL não fornecida.");

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": req.headers['user-agent'] || '',
        "Referer": req.headers['referer'] || '',
      }
    });

    const contentType = response.headers.get("content-type") || 'application/octet-stream';
    res.setHeader("Content-Type", contentType);
    res.setHeader("Access-Control-Allow-Origin", "*");

    const body = await response.text();
    res.status(200).send(body);
  } catch (error) {
    res.status(500).send("Erro ao obter conteúdo.");
  }
};
