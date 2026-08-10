const fs = require('fs');
const { exec } = require('child_process');

if (!fs.existsSync('./fotos')) {
    fs.mkdirSync('./fotos');
    console.log('📁 Ordner "fotos" wurde erstellt.');
}

console.log('👀 Überwache den Ordner "fotos" auf neue Bilder...');
console.log('Du kannst dieses Fenster minimieren. Jedes Mal, wenn du Fotos hineinziehst, werden sie automatisch veröffentlicht.');

let isExecuting = false;

fs.watch('./fotos', { recursive: true }, (eventType, filename) => {
    if (!filename || filename.startsWith('.')) return;
    if (isExecuting) return;
    isExecuting = true;

    console.log(`\n📁 Änderung erkannt bei: ${filename}`);
    console.log('⏳ Starte automatischen Build- und Upload-Prozess...');

    setTimeout(() => {
        const command = 'node build.js && git add . && git commit -m "Auto-Update: Neue Fotos" && git push';
        
        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error(`❌ Fehler beim Hochladen: ${error.message}`);
                isExecuting = false;
                return;
            }
            console.log('🚀 Erfolgreich! Deine neuen Fotos sind jetzt live auf Vercel.');
            isExecuting = false;
        });
    }, 3000);
});