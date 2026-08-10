const fs = require('fs');
const path = require('path');

const templatePath = 'template.html';
const targetPath = 'fotos.html';

if (!fs.existsSync(templatePath)) {
    console.error('❌ Fehler: Keine "template.html" gefunden!');
    return;
}

const template = fs.readFileSync(templatePath, 'utf8');
const fotoDir = './fotos';
let galleryHtml = '';

if (fs.existsSync(fotoDir)) {
    // Alle Ordner im "fotos"-Verzeichnis durchgehen
    const albums = fs.readdirSync(fotoDir).filter(f => fs.statSync(path.join(fotoDir, f)).isDirectory());
    
    albums.forEach(album => {
        // Titel des Albums schick anzeigen (Unterstriche durch Leerzeichen ersetzen)
        const albumName = album.replace(/_/g, ' ');
        galleryHtml += `<h2 style="color:#00f2fe; margin: 2.5rem 0 1rem; font-size: 1.8rem; border-bottom: 1px solid #25283b; padding-bottom: 0.5rem;">${albumName}</h2>`;
        galleryHtml += `<div class="gallery-grid">`;
        
        // Alle Bilddateien im jeweiligen Album-Ordner suchen
        const albumPath = path.join(fotoDir, album);
        const files = fs.readdirSync(albumPath).filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f));
        
        if (files.length === 0) {
            galleryHtml += `<p style="color: #a0a0a0;">Noch keine Fotos in diesem Album.</p>`;
        }
        
        files.forEach(file => {
            galleryHtml += `
            <div class="gallery-item">
                <img src="fotos/${album}/${file}" alt="${file}">
                <div class="caption">${file.replace(/\.[^/.]+$/, "").replace(/_/g, ' ')}</div>
            </div>`;
        });
        galleryHtml += `</div>`;
    });
}

// Wenn keine Alben da sind
if (!galleryHtml) {
    galleryHtml = '<p style="color: #a0a0a0; text-align: center; padding: 2rem;">Noch keine Foto-Alben vorhanden.</p>';
}

// In die finale fotos.html schreiben
const finalHtml = template.replace('{{GALLERY}}', galleryHtml);
fs.writeFileSync(targetPath, finalHtml);
console.log('✅ Galerie erfolgreich aus echten Ordnern in fotos.html generiert!');