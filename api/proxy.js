export default async function handler(req, res) {
  const url = req.query.url;
  if (!url || !url.startsWith("http://")) {
    return res.status(400).send("URL inválida ou não permitida.");
  }

  try {
    const response = await fetch(url);
    const contentType = response.headers.get("content-type");
    const body = await response.arrayBuffer();
    res.setHeader("Content-Type", contentType);
    res.send(Buffer.from(body));
  } catch (error) {
    res.status(500).send("Erro ao buscar o conteúdo.");
  }
}

