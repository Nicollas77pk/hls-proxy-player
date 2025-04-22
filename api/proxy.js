import https from 'https';
import http from 'http';
import { NextResponse } from 'next/server';

export default async function handler(req, res) {
  const url = req.query.url;

  // Verifica se a URL foi fornecida
  if (!url) {
    return res.status(400).json({ error: 'URL não fornecida.' });
  }

  // BLOQUEIO DE DOMÍNIOS EXTERNOS
  const allowedOrigins = ['https://hls-proxy-player.vercel.app/']; // Substitua pelo seu domínio
  const origin = req.headers.origin || '';
  const referer = req.headers.referer || '';

  if (!allowedOrigins.some(o => origin.includes(o) || referer.includes(o))) {
    return res.status(403).json({ error: 'Acesso não autorizado' });
  }

  // HEADERS CORS
  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const isHttps = url.startsWith('https');
  const proxy = isHttps ? https : http;

  proxy.get(url, (streamRes) => {
    res.writeHead(streamRes.statusCode, streamRes.headers);
    streamRes.pipe(res);
  }).on('error', (err) => {
    res.status(500).json({ error: 'Erro ao buscar a stream.', detail: err.message });
  });
}
