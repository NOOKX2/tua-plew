import { copyFile, mkdir, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const mascotDir = path.join(scriptDir, "../public/mascot");
const sourceDir = path.join(mascotDir, "source");
const assetsDir =
  "/Users/thatchavit/.cursor/projects/Users-thatchavit-fit-to-go/assets";

const SOURCE_MAP: Record<string, string> = {
  run: "______________2569-06-17______11.15.35-0044ea48-061f-4501-a552-5b7a283b6211.png",
  wave: "wave.png",
  rental: "rental.png",
  campaign: "campaign.png",
  chat: "chat.png",
  community: "community.png",
  checkout: "checkout.png",
  friends: "friends.png",
};

function saturation(r: number, g: number, b: number) {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  return max === 0 ? 0 : (max - min) / max;
}

function shouldRemove(r: number, g: number, b: number) {
  if (r > 224 && g > 224 && b > 224) return true;

  const sat = saturation(r, g, b);
  const light = (r + g + b) / 3;
  if (sat < 0.1 && light >= 48 && light <= 125) return true;

  return false;
}

function removeBackground(data: Buffer, width: number, height: number) {
  const pixels = Buffer.from(data);

  for (let i = 0; i < pixels.length; i += 4) {
    const r = pixels[i];
    const g = pixels[i + 1];
    const b = pixels[i + 2];

    if (shouldRemove(r, g, b)) {
      pixels[i + 3] = 0;
    }
  }

  // Feather halos on the silhouette edge.
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;
      if (pixels[i + 3] === 0) continue;

      let nearTransparent = false;
      for (let ny = Math.max(0, y - 1); ny <= Math.min(height - 1, y + 1); ny++) {
        for (let nx = Math.max(0, x - 1); nx <= Math.min(width - 1, x + 1); nx++) {
          if (pixels[(ny * width + nx) * 4 + 3] === 0) nearTransparent = true;
        }
      }

      if (!nearTransparent) continue;

      const r = pixels[i];
      const g = pixels[i + 1];
      const b = pixels[i + 2];
      const light = (r + g + b) / 3;
      const sat = saturation(r, g, b);

      if (light > 200 || (light > 160 && sat < 0.2)) {
        const fade = Math.round(((255 - light) / 55) * 255);
        pixels[i + 3] = Math.max(0, Math.min(255, fade));
      }
    }
  }

  return pixels;
}

async function ensureSources() {
  await mkdir(sourceDir, { recursive: true });

  for (const [name, assetFile] of Object.entries(SOURCE_MAP)) {
    const sourcePath = path.join(sourceDir, `${name}.png`);
    const assetPath = path.join(assetsDir, assetFile);
    try {
      await copyFile(assetPath, sourcePath);
    } catch {
      await copyFile(path.join(mascotDir, `${name}.png`), sourcePath);
    }
  }
}

async function processFile(name: string) {
  const input = path.join(sourceDir, `${name}.png`);
  const output = path.join(mascotDir, `${name}.png`);

  const { data, info } = await sharp(input)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const cleaned = removeBackground(data, info.width, info.height);

  await sharp(cleaned, {
    raw: {
      width: info.width,
      height: info.height,
      channels: 4,
    },
  })
    .png({ compressionLevel: 9, effort: 10 })
    .trim({ threshold: 12 })
    .toFile(output);

  console.log(`Processed ${name}.png`);
}

await ensureSources();
const sources = await readdir(sourceDir);
for (const file of sources) {
  if (file.endsWith(".png")) {
    await processFile(file.replace(/\.png$/, ""));
  }
}
