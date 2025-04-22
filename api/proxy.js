const fetch = require('node-fetch');
const urlModule = require('url');

module.exports = async (req, res) => {
  const targetUrl = req.query.url;
  if (!targetUrl) return res.status(400).send("URL não fornecida.");

  try {
    const parsedUrl = new URL(targetUrl);
    const baseUrl = `${parsedUrl.protocol}//${parsedUrl.host}${parsedUrl.pathname.substring(0, parsedUrl.pathname.lastIndexOf('/') + 1)}`;

    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      },
    });

    if (!response.ok) throw new Error("Erro ao buscar o stream.");

    const contentType = response.headers.get("content-type") || 'application/vnd.apple.mpegurl';
    let data = await response.text();

    // Substituir URLs de segmentos .ts e playlists .m3u8 internas
    data = data.replace(/^(?!#)(.*\.m3u8|.*\.ts)/gm, (line) => {
      const absoluteUrl = urlModule.resolve(baseUrl, line.trim());
      return `/api/proxy?url=${encodeURIComponent(absoluteUrl)}`;
    });

    res.setHeader("Content-Type", contentType);
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.status(200).send(data);
  } catch (err) {
    console.error("Erro no proxy:", err);
    res.status(500).send("Erro ao buscar o stream.");
  }
};
