const fetch = require('node-fetch');
const url = require('url');

module.exports = async (req, res) => {
  const targetUrl = req.query.url;
  if (!targetUrl) return res.status(400).send("URL não fornecida.");

  try {
    const response = await fetch(targetUrl);
    const contentType = response.headers.get("content-type") || 'application/vnd.apple.mpegurl';
    let data = await response.text();

    // Corrigir os caminhos relativos no m3u8
    const parsedUrl = new URL(targetUrl);
    const basePath = parsedUrl.origin + parsedUrl.pathname.substring(0, parsedUrl.pathname.lastIndexOf('/') + 1);

    data = data.replace(/^(?!#)(.+\.ts)$/gm, (match) => {
      // Se já for URL absoluta, não altera
      if (match.startsWith('http')) return match;
      return basePath + match;
    });

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Content-Type", contentType);
    res.status(200).send(data);
  } catch (err) {
    console.error("Erro ao buscar o stream:", err);
    res.status(500).send("Erro ao buscar o stream.");
  }
};
