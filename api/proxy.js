module.exports = async (req, res) => {
  const url = req.query.url;
  if (!url) return res.status(400).send("URL não fornecida.");

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.writeHead(302, { Location: url });
  res.end();
};
