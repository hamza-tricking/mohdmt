// يصغّر صور المنتجات الأصلية (دون تغيير الشكل أو الألوان) ويحفظها في uploads/
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const SRC = process.argv[2] || 'D:/all works/moh dmt/assets';
const OUT = path.join(__dirname, '../uploads');
const MAP = {
  '20261016_194859.jpg.jpeg': 'bella-face-1.jpg',
  '20261016_194904.jpg.jpeg': 'bella-face-2.jpg',
  '20261016_194910.jpg.jpeg': 'bella-face-3.jpg',
  '20261016_194923.jpg.jpeg': 'bella-face-4.jpg',
  '20261016_194933.jpg.jpeg': 'bella-girl-1.jpg',
  '20261016_194944.jpg.jpeg': 'bella-girl-2.jpg',
  '20261016_195001.jpg.jpeg': 'bella-girl-3.jpg',
  '20261016_195009.jpg.jpeg': 'bella-girl-4.jpg',
};

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  for (const [from, to] of Object.entries(MAP)) {
    await sharp(path.join(SRC, from))
      .rotate()
      .resize({ width: 1100 })
      .jpeg({ quality: 85 })
      .toFile(path.join(OUT, to));
    console.log(to);
  }
})();
