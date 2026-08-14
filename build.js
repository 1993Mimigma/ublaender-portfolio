const fs = require('fs');
const path = require('path');

const fotosDir = path.join(__dirname, 'fotos');
const outputFile = path.join(__dirname, 'fotos.html');

function scanDirectory(dir) {
    if (!fs.existsSync(dir)) return [];
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    let result = { folders: {}, images: [] };
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
    const structure = scanDirectory(fotosDir);
    let htmlContent = `<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <title>Ubländer Productions - Fotogalerie</title>
    <style>
        :root { --bg-color: #0d0e15; --accent: #00f2fe; }
        body { background-color: var(--bg-color); color: white; font-family: sans-serif; margin: 0; }
        header { text-align: center; padding: 20px; }
        nav a { color: white; margin: 0 15px; text-decoration: none; }
        .photo-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 15px; padding: 20px; }
        
        /* BILD-SCHUTZ: Unsichtbare Schicht über jedem Bild */
        .img-wrapper { position: relative; display: inline-block; cursor: pointer; }
        .img-wrapper::after { content: ""; position: absolute; top:0; left:0; width:100%; height:100%; background: transparent; }
        
        .photo-item { height: 180px; background-size: cover; background-position: center; border-radius: 8px; }
        #lightbox { position: fixed; top:0; left:0; width:100%; height:100%; background: rgba(0,0,0,0.95); display: none; justify-content: center; align-items: center; z-index: 1000; }
        #lightbox img { max-width: 90vw; max-height: 80vh; }
    </style>
</head>
<body oncontextmenu="return false;"> <!-- Rechtsklick global deaktiviert -->

    <header>
        <h1>Fotogalerie</h1>
        <nav><a href="index.html">Zurück zur Startseite</a></nav>
    </header>

    <div id="app" class="photo-grid"></div>

    <div id="lightbox" onclick="this.style.display='none'">
        <img id="lightbox-img" src="">
    </div>

    <script>
        const galleryData = ${JSON.stringify(structure)};
        // Hier den Code zum Rendern deiner Ordner einfügen...
        // (Wie in der vorherigen Version, ergänzt um die .img-wrapper Klasse für die Schutzschicht)
    </script>
</body>
</html>`;
    fs.writeFileSync(outputFile, htmlContent, 'utf8');
}
generateGallery();