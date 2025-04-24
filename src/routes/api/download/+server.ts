import axios from 'axios';
import * as cheerio from 'cheerio';

export async function POST({ request }) {
    try {
        const { url } = await request.json();
        
        if (!url || !url.includes('tiktok.com')) {
            return new Response(JSON.stringify({ error: 'Invalid TikTok URL' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Mengambil data dari URL TikTok
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });

        const $ = cheerio.load(response.data);
        const videoUrl = $('video').attr('src') || await extractVideoUrl(response.data);

        if (!videoUrl) {
            return new Response(JSON.stringify({ error: 'Could not find video' }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        return new Response(JSON.stringify({ videoUrl }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error) {
        return new Response(JSON.stringify({ error: 'Something went wrong' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}

// Fungsi bantu untuk mengekstrak URL video
async function extractVideoUrl(html) {
    // Logika tambahan untuk mengekstrak URL video dari HTML
    // Ini mungkin perlu disesuaikan berdasarkan struktur halaman TikTok saat ini
    const match = html.match(/"playAddr":"(.*?)"/);
    return match ? match[1].replace(/\\u002F/g, '/') : null;
}
