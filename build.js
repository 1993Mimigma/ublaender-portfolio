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
    const albums = fs.readdirSync(fotoDir).filter(f => fs.statSync(path.join(fotoDir, f)).isDirectory());
    
    albums.forEach(album => {
        galleryHtml += `<h3 style="color:#00f2fe; margin: 2rem 0 1rem; font-size: 1.5rem;">${album.replace(/_/g, ' ')}</h3>`;
        galleryHtml += `<div class="gallery-grid">`;
        
        const files = fs.readdirSync(path.join(fotoDir, album)).filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f));
        
        files.forEach(file => {
            galleryHtml += `
            <div class="gallery-item">
                <img src="fotos/${album}/${file}" alt="${file}">
            </div>`;
        });
        galleryHtml += `</div>`;
    });
}

const finalHtml = template.replace('{{GALLERY}}', galleryHtml || '<p>Noch keine Fotos vorhanden.</p>');
fs.writeFileSync(targetPath, finalHtml);
console.log('✅ Galerie erfolgreich in fotos.html aktualisiert!');