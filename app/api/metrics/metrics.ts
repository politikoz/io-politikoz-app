import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { name, value } = req.body;

    // Aqui você pode enviar as métricas para o Prometheus
    // através do seu backend Node.js

    res.status(200).json({ success: true });
}