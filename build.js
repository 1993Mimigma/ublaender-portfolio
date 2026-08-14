const fs = require('fs');
const path = require('path');

const fotosDir = path.join(__dirname, 'fotos');
const outputFile = path.join(__dirname, 'fotos.html');

// Hilfsfunktion zum rekursiven Auslesen von Ordnern und Unterordnern
function scanDirectory(dir) {
    if (!fs.existsSync(dir)) return [];
    
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    let result = {
        folders: {},
        images: []
    };

    entries.forEach(entry => {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            result.folders[entry.name] = scanDirectory(fullPath);
        } else if (entry.isFile() && /\.(jpg|jpeg|png|webp|gif)$/i.test(entry.name)) {
            result.images.push(entry.name);
        }
    });

    return result;
}

function generateGallery() {
    if (!fs.existsSync(fotosDir)) {
        console.log("⚠️ Ordner 'fotos' nicht gefunden!");
        return;
    }

    const structure = scanDirectory(fotosDir);

    // HTML-Struktur im modernen, coolen Design mit Lightbox-Support
    let htmlContent = `<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ubländer Productions - Fotografie</title>
    <style>
        :root {
            --bg-color: #0b0f19;
            --card-bg: #111827;
            --accent: #38bdf8;
            --text-main: #f3f4f6;
            --text-muted: #9ca3af;
        }
        body {
            font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            background-color: var(--bg-color);
            color: var(--text-main);
            margin: 0;
            padding: 0;
        }
        header {
            text-align: center;
            padding: 40px 20px 20px;
            background: linear-gradient(to bottom, #000000, var(--bg-color));
        }
        h1 {
            font-size: 2.5rem;
            margin: 0;
            letter-spacing: 2px;
            color: var(--text-main);
            text-shadow: 0 0 15px rgba(56, 189, 248, 0.4);
        }
        nav {
            margin-top: 20px;
        }
        nav a {
            color: var(--text-muted);
            text-decoration: none;
            margin: 0 15px;
            font-weight: 600;
            transition: color 0.3s;
        }
        nav a:hover, nav a.active {
            color: var(--accent);
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 40px 20px;
        }
        .section-title {
            font-size: 1.8rem;
            margin-bottom: 20px;
            border-bottom: 2px solid var(--card-bg);
            padding-bottom: 10px;
        }
        /* Grid Layout für Kategorien und Alben */
        .grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
            gap: 25px;
            margin-bottom: 40px;
        }
        .card {
            background-color: var(--card-bg);
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 10px 25px rgba(0,0,0,0.3);
            transition: transform 0.3s, box-shadow 0.3s;
            cursor: pointer;
            border: 1px solid rgba(255,255,255,0.05);
        }
        .card:hover {
            transform: translateY(-5px);
            box-shadow: 0 15px 30px rgba(56, 189, 248, 0.15);
            border-color: rgba(56, 189, 248, 0.3);
        }
        .card-thumb {
            height: 200px;
            background-size: cover;
            background-position: center;
            background-color: #1f2937;
        }
        .card-content {
            padding: 20px;
        }
        .card-content h3 {
            margin: 0 0 10px 0;
            font-size: 1.2rem;
        }
        .card-content p {
            margin: 0;
            color: var(--text-muted);
            font-size: 0.9rem;
        }
        /* Bild-Galerie im Album */
        .photo-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
            gap: 15px;
        }
        .photo-item {
            height: 180px;
            border-radius: 8px;
            background-size: cover;
            background-position: center;
            cursor: pointer;
            transition: transform 0.2s, opacity 0.2s;
        }
        .photo-item:hover {
            transform: scale(1.03);
            opacity: 0.9;
        }
        .back-btn {
            display: inline-block;
            margin-bottom: 20px;
            color: var(--accent);
            text-decoration: none;
            font-weight: bold;
            cursor: pointer;
        }
        .back-btn:hover {
            text-decoration: underline;
        }
        /* Lightbox (Vollbild-Viewer mit Swipe/Pfeiltasten) */
        #lightbox {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.95);
            display: none;
            justify-content: center;
            align-items: center;
            z-index: 1000;
            flex-direction: column;
        }
        #lightbox img {
            max-width: 90vw;
            max-height: 80vh;
            border-radius: 4px;
            box-shadow: 0 0 30px rgba(0,0,0,0.8);
        }
        .lightbox-nav {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            background: rgba(255,255,255,0.1);
            color: white;
            border: none;
            font-size: 2rem;
            padding: 10px 20px;
            cursor: pointer;
            border-radius: 50%;
            transition: background 0.3s;
        }
        .lightbox-nav:hover {
            background: var(--accent);
            color: black;
        }
        #lightbox-prev { left: 30px; }
        #lightbox-next { right: 30px; }
        #lightbox-close {
            position: absolute;
            top: 20px;
            right: 30px;
            background: none;
            border: none;
            color: white;
            font-size: 2.5rem;
            cursor: pointer;
        }
    </style>
</head>
<body>

    <header>
        <h1>UBLÄNDER PRODUCTIONS</h1>
        <nav>
            <a href="index.html">Über mich</a>
            <a href="fotos.html" class="active">Fotos</a>
            <a href="videos.html">Videos</a>
            <a href="kontakt.html">Kontakt</a>
        </nav>
    </header>

    <div class="container" id="app">
        <!-- Inhalt wird dynamisch via JavaScript gesteuert -->
    </div>

    <!-- Lightbox Overlay -->
    <div id="lightbox">
        <button id="lightbox-close">&times;</button>
        <button class="lightbox-nav" id="lightbox-prev">&#10094;</button>
        <img id="lightbox-img" src="" alt="Vollbild">
        <button class="lightbox-nav" id="lightbox-next">&#10095;</button>
    </div>

    <script>
        // Die Ordner- und Dateistruktur direkt aus Node.js eingespeist:
        const galleryData = ${JSON.stringify(structure)};

        let currentAlbumImages = [];
        let currentIndex = 0;

        function renderHome() {
            const app = document.getElementById('app');
            let html = '<h2 class="section-title">Foto-Kategorien</h2><div class="grid">';
            
            const categories = Object.keys(galleryData.folders);
            if (categories.length === 0) {
                html += '<p>Noch keine Kategorien vorhanden.</p>';
            }

            categories.forEach(cat => {
                // Finde ein Vorschaubild aus der Kategorie oder Unterordnern
                let thumb = '';
                const catData = galleryData.folders[cat];
                if (catData.images.length > 0) {
                    thumb = \`fotos/\${cat}/\${catData.images[0]}\`;
                } else {
                    // Suche im ersten Unterordner nach einem Bild
                    const subfolders = Object.keys(catData.folders);
                    if (subfolders.length > 0 && catData.folders[subfolders[0]].images.length > 0) {
                        thumb = \`fotos/\&{cat}/\${subfolders[0]}/\${catData.folders[subfolders[0]].images[0]}\`;
                    }
                }

                html += \`
                    <div class="card" onclick="openCategory('\${cat}')">
                        <div class="card-thumb" style="background-image: url('\${thumb}')"></div>
                        <div class="card-content">
                            <h3>\${cat.replace(/-/g, ' ')}</h3>
                            <p>Kategorie öffnen</p>
                        </div>
                    </div>
                \`;
            });

            html += '</div>';
            app.innerHTML = html;
        }

        function openCategory(catName) {
            const app = document.getElementById('app');
            const catData = galleryData.folders[catName];
            let html = \`<a class="back-btn" onclick="renderHome()">← Zurück zu den Kategorien</a>\`;
            html += \`<h2 class="section-title">\${catName.replace(/-/g, ' ')}</h2>\`;

            let hasContent = false;
            let subHtml = '<div class="grid">';

            // 1. Prüfen ob es Unterordner gibt (z.B. Events)
            const subfolders = Object.keys(catData.folders);
            if (subfolders.length > 0) {
                hasContent = true;
                subfolders.forEach(sub => {
                    let subThumb = '';
                    if (catData.folders[sub].images.length > 0) {
                        subThumb = \`fotos/\${catName}/\${sub}/\${catData.folders[sub].images[0]}\`;
                    }
                    subHtml += \`
                        <div class="card" onclick="openSubFolder('\${catName}', '\${sub}')">
                            <div class="card-thumb" style="background-image: url('\${subThumb}')"></div>
                            <div class="card-content">
                                <h3>\${sub.replace(/-/g, ' ')}</h3>
                                <p>\${catData.folders[sub].images.length} Fotos</p>
                            </div>
                        </div>
                    \`;
                });
                subHtml += '</div>';
                html += subHtml;
            }

            // 2. Prüfen ob direkt Bilder im Hauptordner liegen
            if (catData.images.length > 0) {
                hasContent = true;
                currentAlbumImages = catData.images.map(img => \`fotos/\${catName}/\${img}\`);
                html += '<div class="photo-grid">';
                catData.images.forEach((img, idx) => {
                    html += \`<div class="photo-item" style="background-image: url('fotos/\${catName}/\${img}')" onclick="openLightbox(\${idx})"></div>\`;
                });
                html += '</div>';
            }

            if (!hasContent) {
                html += '<p>Dieser Ordner ist noch leer.</p>';
            }

            app.innerHTML = html;
        }

        function openSubFolder(catName, subName) {
            const app = document.getElementById('app');
            const subData = galleryData.folders[catName].folders[subName];
            
            currentAlbumImages = subData.images.map(img => \`fotos/\${catName}/\${subName}/\${img}\`);

            let html = \`<a class="back-btn" onclick="openCategory('\${catName}')">← Zurück zu \${catName}</a>\`;
            html += \`<h2 class="section-title">\${subName.replace(/-/g, ' ')}</h2>\`;

            if (subData.images.length > 0) {
                html += '<div class="photo-grid">';
                subData.images.forEach((img, idx) => {
                    html += \`<div class="photo-item" style="background-image: url('fotos/\${catName}/\${subName}/\${img}')" onclick="openLightbox(\${idx})"></div>\`;
                });
                html += '</div>';
            } else {
                html += '<p>Keine Fotos in diesem Event-Ordner gefunden.</p>';
            }

            app.innerHTML = html;
        }

        // Lightbox Steuerung (Swipen, Pfeiltasten, Klicks)
        const lightbox = document.getElementById('lightbox');
        const lightboxImg = document.getElementById('lightbox-img');
        
        function openLightbox(index) {
            currentIndex = index;
            lightboxImg.src = currentAlbumImages[currentIndex];
            lightbox.style.display = 'flex';
        }

        function closeLightbox() {
            lightbox.style.display = 'none';
        }

        function nextImage() {
            currentIndex = (currentIndex + 1) % currentAlbumImages.length;
            lightboxImg.src = currentAlbumImages[currentIndex];
        }

        function prevImage() {
            currentIndex = (currentIndex - 1 + currentAlbumImages.length) % currentAlbumImages.length;
            lightboxImg.src = currentAlbumImages[currentIndex];
        }

        document.getElementById('lightbox-close').onclick = closeLightbox;
        document.getElementById('lightbox-next').onclick = nextImage;
        document.getElementById('lightbox-prev').onclick = prevImage;

        // Tastatursteuerung (Pfeiltasten links/rechts & Escape)
        document.addEventListener('keydown', (e) => {
            if (lightbox.style.display === 'flex') {
                if (e.key === 'ArrowRight') nextImage();
                if (e.key === 'ArrowLeft') prevImage();
                if (e.key === 'Escape') closeLightbox();
            }
        });

        // Touch / Wischgesten (Swipe) für Smartphones und Tablets
        let touchStartX = 0;
        let touchEndX = 0;

        lightbox.addEventListener('touchstart', e => {
            touchStartX = e.changedTouches[0].screenX;
        });

        lightbox.addEventListener('touchend', e => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        });

        function handleSwipe() {
            if (touchEndX < touchStartX - 50) {
                nextImage(); // Nach links gewischt -> Nächstes Bild
            }
            if (touchEndX > touchStartX + 50) {
                prevImage(); // Nach rechts gewischt -> Vorheriges Bild
            }
        }

        // Starten
        renderHome();
    </script>
</body>
</html>`;

    fs.writeFileSync(outputFile, htmlContent, 'utf8');
    console.log("✅ Coole, moderne Galerie erfolgreich mit allen Unterordnern in fotos.html generiert!");
}

generateGallery();