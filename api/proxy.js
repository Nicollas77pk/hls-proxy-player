const fetch = require("node-fetch");

module.exports = async (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).send("URL não fornecida.");

  try {
    const response = await fetch(url);
    const m3u8 = await response.text();

    const baseUrl = url.split("/").slice(0, -1).join("/");
    const proxied = m3u8.replace(/(.*\.ts)/g, match => `${req.url.split("?")[0]}?url=${baseUrl}/${match}`);

    res.setHeader("Content-Type", "application/vnd.apple.mpegurl");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.status(200).send(proxied);
  } catch (err) {
    res.status(500).send("Erro ao carregar playlist.");
  }
};
