import sharp from "sharp";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const targets = [
  { input: "../banner.png", widths: [720, 1240], fallback: "png" },
  { input: "../hero-image.png", widths: [720, 1200], fallback: "png" },
  { input: "../logo.png", widths: [400, 800], fallback: "png" },
  { input: "../services/photo_place_camera.png", widths: [720, 1200], fallback: "png" },
  { input: "../services/passport.jpg", widths: [560, 1040], fallback: "jpg" },
  { input: "../services/restavration2.png", widths: [560, 1040], fallback: "png" },
  { input: "../services/restavration3.png", widths: [560, 1040], fallback: "png" },
  { input: "../services/sovm.jpeg", widths: [560, 1040], fallback: "jpg" },
  { input: "../services/print.jpeg", widths: [560, 1040], fallback: "jpg" },
  { input: "../services/5.jpg", widths: [560, 1040], fallback: "jpg" },
  { input: "../services/to_home.jpg", widths: [560, 1040], fallback: "jpg" },
  ...Array.from({ length: 11 }, (_, i) => ({
    input: `../people2/${i + 1}.png`,
    widths: [320, 640],
    fallback: "png"
  })),
  {
    input: "../people2/sophy.png",
    widths: [320, 640],
    fallback: "png"
  },
  ...["1.jpg", "2.JPG", "3.jpg", "5.jpg", "6.jpg", "kak_dobratsya.png"].map((name) => ({
    input: `../place/${name}`,
    widths: [420, 840],
    fallback: /\.(png)$/i.test(name) ? "png" : "jpg"
  }))
];

function extForFallback(type) {
  return type === "jpg" ? "jpg" : "png";
}

async function processTarget(target) {
  const absInput = path.resolve(__dirname, target.input);
  const image = sharp(absInput, { failOn: "none" });
  const meta = await image.metadata();
  const parsed = path.parse(absInput);

  for (const width of target.widths) {
    const outputWidth = meta.width ? Math.min(meta.width, width) : width;
    const webpPath = path.join(parsed.dir, `${parsed.name}-w${width}.webp`);
    await image.clone().resize({ width: outputWidth, withoutEnlargement: true }).webp({ quality: 82 }).toFile(webpPath);

    const fallbackExt = extForFallback(target.fallback);
    const fallbackPath = path.join(parsed.dir, `${parsed.name}-w${width}.${fallbackExt}`);
    const fallbackImage = image.clone().resize({ width: outputWidth, withoutEnlargement: true });

    if (fallbackExt === "jpg") {
      await fallbackImage.jpeg({ quality: 84, mozjpeg: true }).toFile(fallbackPath);
    } else {
      await fallbackImage.png({ compressionLevel: 9 }).toFile(fallbackPath);
    }
  }
}

async function main() {
  for (const target of targets) {
    await processTarget(target);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
