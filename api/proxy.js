export default async function handler(req, res) {
  const url = req.query.url;
  if (!url || !url.startsWith('http://')) {
    return res.status(400).send('URL inválida ou ausente.');
  }

  try {
    const response = await fetch(url);
    const contentType = response.headers.get('content-type');

    res.setHeader('Content-Type', contentType);
    response.body.pipe(res);
  } catch (error) {
    res.status(500).send('Erro ao buscar a URL.');
  }
}
