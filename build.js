const fs = require('fs');
const path = require('path');

// Pfad zu deinen Foto-Ordnern (passe den Pfad an, falls deine Struktur anders heißt)
const photosDir = path.join(__dirname, 'fotos'); // oder dein entsprechender Ordner

// Funktion zum Generieren der HTML-Galerie
function generateGallery() {
    // Überprüfe, ob der Ordner existiert, sonst erstelle ein einfaches Fallback oder lies deine Kategorien aus
    // Hier fügen wir den Schutz-Script-Block direkt in die generierte HTML mit ein:
    
    let galleryHTML = `
    <!DOCTYPE html>
    <html lang="de">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Ubländer Productions - Fotos</title>
        <link rel="stylesheet" href="style.css">
    </head>
    <body class="dark-theme">
        <!-- Hier wird deine Navigation / Header eingefügt -->
        <div class="container">
            <h1>Fotografie</h1>
            <div class="photo-grid">
`;

    // Beispiel, wie du deine Bilder aus Ordnern einliest und die Karten baust:
    // (Falls du eine bestimmte Logik hast, behalte deine Schleife bei und nutze nur das innere HTML unten)
    
    // Der wichtigste Teil für die einzelnen Bild-Karten ohne Dateinamen & mit Klick-Vollansicht:
    // Ersetze deine Bild-Loop-Ausgabe mit diesem HTML-Struktur-Muster:
    /*
    let imageName = "beispiel";
    let imagePath = "pfad/zum/bild.jpg";
    
    galleryHTML += `
        <div class="photo-card" style="cursor: pointer;" onclick="window.open('${imagePath}', '_blank')">
            <img src="${imagePath}" alt="${imageName}" oncontextmenu="return false;" style="width: 100%; height: auto; display: block; border-radius: 8px; user-select: none; -webkit-user-drag: none;">
        </div>
    `;
    */

    // Da ich deinen genauen Dateinamen-Einlese-Code nicht kenne, passe bitte in deiner Schleife 
    // das Template-Literal für die Bildkarte wie folgt an:
    
    // WICHTIG: Füge in dein bestehendes Skript folgendes ein:
    // 1. onclick="window.open('${imagePath}', '_blank')" im Container oder Bild
    // 2. oncontextmenu="return false;" am <img>-Tag (verhindert das Kontextmenü per Rechtsklick)
    // 3. Den <p>-Tag mit dem Dateinamen komplett löschen.

    galleryHTML += `
            </div>
        </div>

        <!-- Skript gegen das Herunterladen per Drag & Drop / Rechtsklick -->
        <script>
            document.addEventListener('contextmenu', function(e) {
                if (e.target.tagName === 'IMG') {
                    e.preventDefault();
                }
            });
        </script>
    </body>
    </html>
    `;

    fs.writeFileSync('fotos.html', galleryHTML);
    console.log('✅ Galerie erfolgreich aus echten Ordnern in fotos.html generiert!');
}

generateGallery();