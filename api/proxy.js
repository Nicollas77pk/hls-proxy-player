// api/proxy.js

export default async (req, res) => {
  const targetUrl = req.query.url;
  if (!targetUrl) return res.status(400).send("URL não fornecida.");

  try {
    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent': req.headers['user-agent'] || 'Mozilla/5.0',
      },
    });

    if (!response.ok) {
      return res.status(response.status).send("Erro ao buscar o stream.");
    }

    const contentType = response.headers.get("content-type") || 'application/vnd.apple.mpegurl';
    const data = await response.text();

    res.setHeader("Content-Type", contentType);
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "*");
    res.status(200).send(data);
  } catch (err) {
    console.error("Erro ao buscar o stream:", err);
    res.status(500).send("Erro interno ao buscar o stream.");
  }
};
