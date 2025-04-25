<script>
    import { onMount } from 'svelte';
    import { browser } from '$app/environment';

    let url = '';
    let videoUrl = '';
    let error = '';
    let loading = false;

    // Muat skrip iklan saat komponen dimuat di browser
    onMount(() => {
        if (!browser) return; // Pastikan hanya berjalan di browser

        // Buat elemen <script>
        const ad1 = document.getElementById('ad1');
        const script = document.createElement('script');
        script.src = 'https://curoax.com/na/waWQiOjEyMDA2NTcsInNpZCI6MTUwNDYwNCwid2lkIjo3MTA2MTYsInNyYyI6Mn0=eyJ.js';
        script.async = true;

        // Tambahkan skrip ke dokumen
        ad1?.appendChild(script);

        // Bersihkan skrip saat komponen dihancurkan (opsional)
        return () => {
            document.body.removeChild(script);
        };
    });

    async function downloadVideo() {
        loading = true;
        error = '';
        videoUrl = '';

        try {
            const response = await fetch('/api/download', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ url })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Something went wrong');
            }

            videoUrl = data.videoUrl;
        } catch (err) {
            error = err.message;
        } finally {
            loading = false;
        }
    }
</script>

<main class="min-h-screen bg-gray-100 flex items-center justify-center p-4">
    <div class="max-w-2xl w-full bg-white rounded-lg shadow-lg p-6">
        <h1 class="text-2xl font-bold text-center mb-6 text-gray-800">
            TikTok Video Downloader
        </h1>

        <div class="space-y-4">
            <input
                type="text"
                bind:value={url}
                placeholder="Paste TikTok URL here"
                disabled={loading}
                class="w-full p-3 border rounded-md focus:ring-2 focus:ring-pink-500 focus:border-transparent disabled:bg-gray-100"
            />

            <button
                on:click={downloadVideo}
                class="w-full p-3 bg-pink-500 text-white rounded-md hover:bg-pink-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
                {loading ? 'Downloading...' : 'Download'}
            </button>

            {#if error}
                <p class="text-red-500 text-center">{error}</p>
            {/if}

            {#if videoUrl}
                <div class="mt-6 space-y-4">
                    <video controls src={videoUrl} class="w-full rounded-md"></video>
                    <p>{videoUrl}</p>
                    <a
                        href={videoUrl}
                        download="tiktok-video.mp4"
                        class="block text-center p-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                    >
                        Download Video
                    </a>
                </div>
            {/if}
            <div class="flex w-full justify-center items-center" id="ad1">
                
            </div>
        </div>
    </div>
</main>