const fs = require('fs');
const path = require('path');

const fotosDir = path.join(__dirname, 'fotos');

function generateGallery() {
    let categoriesHTML = '';

    if (fs.existsSync(fotosDir)) {
        const categories = fs.readdirSync(fotosDir, { withFileTypes: true })
            .filter(dirent => dirent.isDirectory());

        categories.forEach(category => {
            const categoryName = category.name;
            const categoryDir = path.join(fotosDir, categoryName);
            const images = fs.readdirSync(categoryDir)
                .filter(file => /\.(jpg|jpeg|png|webp|avif)$/i.test(file));

            categoriesHTML += `
                <div class="category-section" style="margin-bottom: 40px;">
                    <h2 style="color: #00f0ff; margin-bottom: 20px;">${categoryName}</h2>
                    <div class="photo-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 20px;">
            `;

            images.forEach(image => {
                const imagePath = `fotos/${categoryName}/${image}`;
                categoriesHTML += `
                    <div class="photo-card" style="cursor: pointer;" onclick="window.open('${imagePath}', '_blank')">
                        <img src="${imagePath}" alt="${image}" oncontextmenu="return false;" style="width: 100%; height: auto; display: block; border-radius: 8px; user-select: none; -webkit-user-drag: none;">
                    </div>
                `;
            });

            categoriesHTML += `
                    </div>
                </div>
            `;
        });
    }

    let galleryHTML = `
    <!DOCTYPE html>
    <html lang="de">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Ubländer Productions - Fotos</title>
        <link rel="stylesheet" href="style.css">
    </head>
    <body class="dark-theme" style="background-color: #0b0f19; color: #fff; font-family: sans-serif; padding: 20px;">
        <div class="container" style="max-width: 1200px; margin: 0 auto;">
            <h1 style="text-align: center; margin-bottom: 10px;">Fotografie</h1>
            <p style="text-align: center; color: #a0aec0; margin-bottom: 40px;">Eine Auswahl meiner Fotografie-Projekte: Konzerte, Events, Portraits und freie Arbeiten.</p>
            ${categoriesHTML}
        </div>

        <script>
            // Verhindert das Herunterladen per Rechtsklick auf Bilder
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