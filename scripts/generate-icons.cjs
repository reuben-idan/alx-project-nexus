const fs = require('fs');
const path = require('path');

(async function generate() {
  const sharp = require('sharp');
  const publicDir = path.join(__dirname, '..', 'public');
  const src = path.join(publicDir, 'logo.png');

  if (!fs.existsSync(src)) {
    console.error('Source logo not found at', src);
    process.exit(1);
  }

  const out192 = path.join(publicDir, 'icon-192.png');
  const out512 = path.join(publicDir, 'icon-512.png');

  try {
    await sharp(src).resize(192, 192, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toFile(out192);
    await sharp(src).resize(512, 512, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toFile(out512);
    console.log('Generated', out192, 'and', out512);
  } catch (err) {
    console.error('Error generating icons:', err);
    process.exit(1);
  }
})();
