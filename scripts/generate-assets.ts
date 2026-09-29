import fs from "fs";
import path from "path";
import https from "https";
import sharp from "sharp";

const OUTPUT_DIR = path.join(process.cwd(), "public");

const STYLE_PROMPT = "deep navy and gold colors, art nouveau mysticism, fine celestial linework, elegant, spiritual, mystical, high quality, symmetrical";

const ASSETS = [
  {
    name: "logo_source.jpg",
    prompt: "A mystical tarot logo featuring casting lots and celestial motifs, " + STYLE_PROMPT,
    width: 1024,
    height: 1024
  },
  {
    name: "card_back.jpg",
    prompt: "An ornate tarot card back design, " + STYLE_PROMPT,
    width: 700,
    height: 1200
  },
  {
    name: "hero_background.jpg",
    prompt: "A beautiful celestial starry night sky background with floating gold particles and subtle glowing nebulas, " + STYLE_PROMPT,
    width: 1920,
    height: 1080
  }
];

function fetchImage(url: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode !== 200) {
        return reject(new Error(`Failed to fetch image: ${res.statusCode} ${url}`));
      }
      const data: Buffer[] = [];
      res.on("data", (chunk) => data.push(chunk));
      res.on("end", () => resolve(Buffer.concat(data)));
    }).on("error", reject);
  });
}

async function generateAssets() {
  console.log("Generating visual assets via Pollinations...");
  
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  for (const asset of ASSETS) {
    const assetPath = path.join(OUTPUT_DIR, asset.name);
    if (!fs.existsSync(assetPath)) {
      console.log(`Generating ${asset.name}...`);
      const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(asset.prompt)}?width=${asset.width}&height=${asset.height}&nologo=true`;
      
      try {
        const imgBuffer = await fetchImage(url);
        fs.writeFileSync(assetPath, imgBuffer);
        console.log(`Saved ${asset.name}`);
      } catch (e) {
        console.error(`Failed to generate ${asset.name}:`, e);
      }
    } else {
      console.log(`${asset.name} already exists.`);
    }
  }

  console.log("Processing icons and favicons...");
  const logoPath = path.join(OUTPUT_DIR, "logo_source.jpg");
  if (fs.existsSync(logoPath)) {
    // Generate icons
    const iconSizes = [192, 512];
    for (const size of iconSizes) {
      await sharp(logoPath)
        .resize(size, size)
        .png()
        .toFile(path.join(OUTPUT_DIR, `icon-${size}x${size}.png`));
      
      // Maskable icon
      await sharp(logoPath)
        .resize(size, size, { fit: 'contain', background: { r: 10, g: 10, b: 26, alpha: 1 } })
        .png()
        .toFile(path.join(OUTPUT_DIR, `icon-${size}x${size}-maskable.png`));
    }
    
    // Apple touch icon
    await sharp(logoPath)
      .resize(180, 180)
      .png()
      .toFile(path.join(OUTPUT_DIR, "apple-touch-icon.png"));

    // Favicon (32x32)
    await sharp(logoPath)
      .resize(32, 32)
      .png()
      .toFile(path.join(OUTPUT_DIR, "favicon.png"));

    // OG Image
    await sharp(logoPath)
      .resize(1200, 630, { fit: 'cover' })
      .jpeg({ quality: 80 })
      .toFile(path.join(OUTPUT_DIR, "og-image.png"));
      
    console.log("All derived assets created successfully!");
  }
}

generateAssets().catch(console.error);
