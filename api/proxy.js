module.exports = async (req, res) => {
  const targetUrl = req.query.url; // URL m3u8 fornecida como query string
  const response = await fetch(targetUrl);
  const data = await response.text();
  
  res.setHeader('Content-Type', 'application/vnd.apple.mpegurl');
  res.status(200).send(data);
};
