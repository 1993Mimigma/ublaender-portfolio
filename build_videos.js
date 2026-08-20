const fs = require('fs');
const path = require('path');

// Pfade definieren
const videosOrdner = path.join(__dirname, 'videos');
const jsonAusgabe = path.join(__dirname, 'videos.json');

function erstelleVideoJson() {
    // Prüfe, ob der Ordner "videos" existiert
    if (!fs.existsSync(videosOrdner)) {
        console.log('Der Ordner "videos" existiert nicht. Erstelle einen leeren Ordner...');
        fs.mkdirSync(videosOrdner);
    }

    const dateien = fs.readdirSync(videosOrdner);
    const videoListe = [];

    dateien.forEach(datei => {
        // Nur .txt Dateien auslesen
        if (path.extname(datei).toLowerCase() === '.txt') {
            const dateiPfad = path.join(videosOrdner, datei);
            const rawInhalt = fs.readFileSync(dateiPfad, 'utf-8').trim();

            if (rawInhalt) {
                // Wandle Standard-YouTube-URLs & Shorts in Embed-Links um
                let embedUrl = rawInhalt;
                const match = rawInhalt.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/);

                if (match && match[1]) {
                    embedUrl = `https://www.youtube-nocookie.com/embed/${match[1]}`;
                }

                videoListe.push({
                    titel: path.basename(datei, '.txt').replace(/_/g, ' '),
                    url: embedUrl,
                    originalUrl: rawInhalt
                });
            }
        }
    });

    // Erstelle oder überschreibe die videos.json
    fs.writeFileSync(jsonAusgabe, JSON.stringify(videoListe, null, 2), 'utf-8');
    console.log(`Erfolg! videos.json wurde mit ${videoListe.length} Video(s) erstellt.`);
}

erstelleVideoJson();
