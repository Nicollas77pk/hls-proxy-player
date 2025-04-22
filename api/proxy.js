const fetch = require('node-fetch');
const url = require('url');

module.exports = async (req, res) => {
  const targetUrl = req.query.url;
  if (!targetUrl) return res.status(400).send("URL não fornecida.");

  const targetUrlObj = new URL(targetUrl);
  const baseUrl = `${targetUrlObj.protocol}//${targetUrlObj.host}`; // Base URL para segmentos `.ts`

  // Se a URL for para um arquivo .m3u8 (playlist)
  if (targetUrl.endsWith('.m3u8')) {
    try {
      const response = await fetch(targetUrl, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
          "Accept": "*/*",
          "Connection": "keep-alive"
        }
      });

      const contentType = response.headers.get("content-type") || 'application/vnd.apple.mpegurl';
      let data = await response.text();

      // Modificar os links dos arquivos .ts para que passem pelo proxy
      data = data.replace(/(http[^"\n]+\.ts)/g, (match) => {
        return baseUrl + '/proxy?url=' + encodeURIComponent(match);
      });

      res.setHeader("Content-Type", contentType);
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Access-Control-Allow-Headers", "*");
      res.status(200).send(data);
    } catch (err) {
      console.error("Erro ao buscar o stream .m3u8:", err);
      res.status(500).send("Erro ao buscar o stream.");
    }
  } else if (targetUrl.endsWith('.ts')) {
    // Proxy para o arquivo .ts
    try {
      const response = await fetch(targetUrl, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
          "Accept": "*/*",
          "Connection": "keep-alive"
        }
      });

      const contentType = response.headers.get("content-type") || 'video/mp2t'; // Tipo de conteúdo para arquivos .ts
      const data = await response.buffer(); // Usar buffer para arquivos binários como .ts

      res.setHeader("Content-Type", contentType);
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Access-Control-Allow-Headers", "*");
      res.status(200).send(data);
    } catch (err) {
      console.error("Erro ao buscar o arquivo .ts:", err);
      res.status(500).send("Erro ao buscar o arquivo .ts.");
    }
  } else {
    res.status(400).send("Formato não suportado.");
  }
};
