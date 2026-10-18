// Runs after every build (see "postbuild" in package.json). Makes a small
// .webp copy of every screenshot and article banner in dist/, next to the
// original — e.g. dist/resources/foo.png → dist/resources/foo.webp.
// The <Picture> component in src/ui.jsx serves these copies to visitors.
//
// Why: the originals are 1-2 MB each (the Resources page alone was ~18 MB).
// The .webp copies look the same and are many times smaller. Nothing to do
// by hand when adding images: drop the .png/.jpg in public/ as usual and the
// next build makes its copy.
import { readdirSync, statSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const DIST = join(dirname(fileURLToPath(import.meta.url)), "..", "dist");
// Folder → widest the image ever needs to be. Article banners show at most
// ~730px wide (1200 covers sharp phone/retina screens); screenshots are shown
// up to full screen width and have small spreadsheet text, so they keep more.
const FOLDERS = { resources: 1200, screenshots: 2000 };

let before = 0;
let after = 0;
let count = 0;
for (const [folder, maxWidth] of Object.entries(FOLDERS)) {
  const dir = join(DIST, folder);
  const files = readdirSync(dir).filter((f) => /\.(png|jpe?g)$/i.test(f));
  await Promise.all(files.map(async (file) => {
    const src = join(dir, file);
    const info = await sharp(src)
      .resize({ width: maxWidth, withoutEnlargement: true })
      .webp({ quality: 80 })
      .toFile(src.replace(/\.(png|jpe?g)$/i, ".webp"));
    before += statSync(src).size;
    after += info.size;
    count += 1;
  }));
}
const mb = (n) => (n / 1024 / 1024).toFixed(1);
console.log(`optimize-images: ${count} images, ${mb(before)} MB → ${mb(after)} MB as .webp`);
