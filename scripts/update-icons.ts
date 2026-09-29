import fs from "fs";
import path from "path";
import sharp from "sharp";

const OUTPUT_DIR = path.join(process.cwd(), "public");

async function generateDerived() {
  console.log("Processing icons and favicons...");
  const logoPath = path.join(OUTPUT_DIR, "logo_source.jpg");
  if (fs.existsSync(logoPath)) {
    const iconSizes = [192, 512];
    for (const size of iconSizes) {
      await sharp(logoPath)
        .resize(size, size)
        .png()
        .toFile(path.join(OUTPUT_DIR, `icon-${size}x${size}.png`));
      
      await sharp(logoPath)
        .resize(size, size, { fit: 'contain', background: { r: 10, g: 10, b: 26, alpha: 1 } })
        .png()
        .toFile(path.join(OUTPUT_DIR, `icon-${size}x${size}-maskable.png`));
    }
    
    await sharp(logoPath)
      .resize(180, 180)
      .png()
      .toFile(path.join(OUTPUT_DIR, "apple-touch-icon.png"));

    await sharp(logoPath)
      .resize(32, 32)
      .png()
      .toFile(path.join(OUTPUT_DIR, "favicon.png"));

    await sharp(logoPath)
      .resize(1200, 630, { fit: 'cover' })
      .jpeg({ quality: 80 })
      .toFile(path.join(OUTPUT_DIR, "og-image.png"));
      
    console.log("All derived assets created successfully!");
  }
}

generateDerived().catch(console.error);
