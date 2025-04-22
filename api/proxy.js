const fetch = require('node-fetch');

module.exports = async (req, res) => {
  const targetUrl = req.query.url;
  if (!targetUrl) return res.status(400).send("URL não fornecida.");

  try {
    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/122.0.0.0 Safari/537.36',
        'Referer': targetUrl
      }
    });

    const contentType = response.headers.get("content-type") || 'application/vnd.apple.mpegurl';
    let data = await response.text();

    // Reescreve os caminhos relativos para passar pelo proxy
    const baseUrl = new URL(targetUrl);
    const basePath = baseUrl.origin + baseUrl.pathname.substring(0, baseUrl.pathname.lastIndexOf('/') + 1);

    data = data.replace(/^(?!#)([^\n]*)/gm, (line) => {
      if (line.startsWith("http") || line.startsWith("/")) return line; // já é absoluto
      return `/api/proxy?url=${encodeURIComponent(basePath + line)}`;
    });

    res.setHeader("Content-Type", contentType);
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.status(200).send(data);

  } catch (err) {
    console.error("Erro ao buscar stream:", err);
    res.status(500).send("Erro ao buscar o stream.");
  }
};
