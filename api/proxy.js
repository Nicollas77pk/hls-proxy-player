// /api/proxy.js (Vercel Function)
export default async function handler(req, res) {
    const { url } = req.query;  // Pega a URL do m3u8 (em HTTP)
    
    if (!url) {
        return res.status(400).json({ error: 'URL não fornecida' });
    }

    try {
        // Requisição ao link HTTP
        const response = await fetch(url);
        const data = await response.text();  // Pode ser stream ou text dependendo do tipo do conteúdo
        
        res.setHeader('Content-Type', 'application/x-mpegURL'); // Para garantir o tipo correto
        res.status(200).send(data);  // Envia o conteúdo para o cliente
    } catch (error) {
        console.error('Erro ao acessar a URL:', error);
        res.status(500).json({ error: 'Erro ao buscar o conteúdo.' });
    }
}
