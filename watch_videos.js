const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const videosOrdner = path.join(__dirname, 'videos');

// Erstelle den Ordner "videos", falls er noch nicht existiert
if (!fs.existsSync(videosOrdner)) {
    fs.mkdirSync(videosOrdner);
    console.log('Ordner "videos" wurde erstellt.');
}

function starteBuild() {
    console.log('Änderung im Videos-Ordner erkannt! Führe build.js aus...');
    exec('node build.js', (error, stdout, stderr) => {
        if (error) {
            console.error(`Fehler beim Ausführen von build.js: ${error.message}`);
            return;
        }
        if (stderr) {
            console.error(`Build Stderr: ${stderr}`);
        }
        console.log(`Build erfolgreich ausgeführt:
${stdout}`);
    });
}

// Überwache den Ordner "videos" inklusive Unterordner
fs.watch(videosOrdner, { recursive: true }, (eventType, filename) => {
    if (filename) {
        console.log(`Änderung erkannt in videos/${filename} (${eventType})`);
        starteBuild();
    }
});

console.log('Beobachte den Ordner "videos" auf Änderungen...');
