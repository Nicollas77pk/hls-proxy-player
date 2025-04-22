const https = require('https');
const http = require('http');

module.exports = (req, res) => {
  const url = req.query.url;
  if (!url) return res.status(400).send("URL não fornecida.");

  const client = url.startsWith('https') ? https : http;

  client.get(url, (streamRes) => {
    res.setHeader('Content-Type', streamRes.headers['content-type'] || 'application/vnd.apple.mpegurl');
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Cache-Control", "no-cache");
    streamRes.pipe(res);
  }).on('error', () => {
    res.status(500).send("Erro ao redirecionar o stream.");
  });
};
