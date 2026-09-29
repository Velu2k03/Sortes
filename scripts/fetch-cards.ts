import fs from "fs";
import path from "path";
import sharp from "sharp";
import https from "https";

// URLs
const INTERPRETATIONS_URL = "https://raw.githubusercontent.com/dariusk/corpora/master/data/divination/tarot_interpretations.json";
const METABISMUTH_URL = "https://raw.githubusercontent.com/metabismuth/tarot-json/master/tarot-images.json";

const OUTPUT_DIR = path.join(process.cwd(), "public", "cards");
const DATA_FILE = path.join(process.cwd(), "public", "cards.json");

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Node fetch can be used directly in v24
async function fetchJson(url: string) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);
  return res.json();
}

function fetchImage(url: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { "User-Agent": "Sortes Tarot App / support.sortes@resonantatlas.com" } }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302 || res.statusCode === 307 || res.statusCode === 308) {
        return fetchImage(res.headers.location!).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`Failed to fetch image: ${res.statusCode} ${url}`));
      }
      const data: Buffer[] = [];
      res.on("data", (chunk) => data.push(chunk));
      res.on("end", () => resolve(Buffer.concat(data)));
    }).on("error", reject);
  });
}

async function processCards() {
  console.log("Fetching datasets...");
  const interpretationsData = await fetchJson(INTERPRETATIONS_URL);
  const metabismuthData = await fetchJson(METABISMUTH_URL);
  
  const cards = [];
  
  const suitsMap: Record<string, string> = {
    "wands": "Wands",
    "cups": "Cups",
    "swords": "Swords",
    "pentacles": "Pentacles",
    "coins": "Pentacles"
  };

  // Create a lookup for metabismuth images by name
  const imageLookup = new Map();
  const normalize = (s: string) => s.toLowerCase().replace(/^(the\s)/, '').replace(/[^a-z0-9]/g, '');
  for (const c of metabismuthData.cards) {
    imageLookup.set(normalize(c.name), c.img);
  }
  // Missing ones manual mapping
  imageLookup.set(normalize("The Papess/High Priestess"), imageLookup.get(normalize("High Priestess")));
  imageLookup.set(normalize("The Pope/Hierophant"), imageLookup.get(normalize("The Hierophant")));
  imageLookup.set(normalize("The Wheel"), imageLookup.get(normalize("Wheel of Fortune")));

  for (const card of interpretationsData.tarot_interpretations) {
    const isMajor = card.suit === "major";
    let suit = null;
    let arcana = "Major";
    let filename = "";
    
    // Fix name 
    let finalName = card.name;
    if (finalName === "The Papess/High Priestess") finalName = "The High Priestess";
    if (finalName === "The Pope/Hierophant") finalName = "The Hierophant";
    if (finalName === "The Wheel") finalName = "Wheel of Fortune";
    if (card.suit === "coins") finalName = finalName.replace(/coins/i, "Pentacles");
    finalName = finalName.replace(/\b\w/g, (c: string) => c.toUpperCase());
    if (isMajor) {
      const numStr = card.rank.toString().padStart(2, '0');
      const nameSafe = finalName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      filename = `major-${numStr}-${nameSafe}.jpg`;
    } else {
      arcana = "Minor";
      suit = suitsMap[card.suit] || card.suit.charAt(0).toUpperCase() + card.suit.slice(1);
      
      let valStr = card.rank.toString().padStart(2, '0');
      if (card.rank === 1) valStr = "ace";
      else if (card.rank === 11) valStr = "page";
      else if (card.rank === 12) valStr = "knight";
      else if (card.rank === 13) valStr = "queen";
      else if (card.rank === 14) valStr = "king";
      
      filename = `${suit.toLowerCase()}-${valStr}.jpg`;
    }
    
    const mappedCard = {
      id: finalName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
      name: finalName,
      arcana,
      suit,
      number: card.rank,
      keywords: {
        upright: card.keywords.slice(0, 6),
        reversed: card.meanings.shadow.slice(0, 6),
      },
      meaning: {
        upright: card.meanings.light.join(". ") + ".",
        reversed: card.meanings.shadow.join(". ") + ".",
      },
      image: `/cards/${filename}`
    };
    
    const mbImg = imageLookup.get(normalize(finalName));
    const imagePath = path.join(OUTPUT_DIR, filename);

    if (!fs.existsSync(imagePath) && mbImg) {
      console.log(`Downloading ${filename}...`);
      try {
        const imgUrl = `https://raw.githubusercontent.com/metabismuth/tarot-json/master/cards/${mbImg}`;
        const imgBuffer = await fetchImage(imgUrl);
        
        await sharp(imgBuffer)
          .resize({ width: 700, withoutEnlargement: true })
          .jpeg({ quality: 82 })
          .toFile(imagePath);
      } catch (err) {
        console.error(`Failed to process image for ${card.name}`, err);
      }
      
      // Be nice to GitHub raw
      await new Promise(r => setTimeout(r, 200));
    }
    
    cards.push(mappedCard);
  }
  
  fs.writeFileSync(DATA_FILE, JSON.stringify(cards, null, 2));
  console.log("cards.json generated!");
}

processCards().catch(console.error);
