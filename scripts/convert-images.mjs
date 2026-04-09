import sharp from 'sharp';
import { readdir } from 'fs/promises';
import { unlinkSync } from 'fs';
import { join, extname, basename } from 'path';

const PICS_DIR = new URL('../static/pics', import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1');

const files = await readdir(PICS_DIR);
const images = files.filter(f => /\.(jpe?g|png)$/i.test(f));

for (const file of images) {
  const ext = extname(file);
  const name = basename(file, ext);
  const input = join(PICS_DIR, file);
  const output = join(PICS_DIR, `${name}.webp`);

  if (output === input) continue; // already webp

  const info = await sharp(input)
    .webp({ quality: 82, effort: 6 })
    .toFile(output);

  const { statSync } = await import('fs');
  const orig = statSync(input).size;
  const savings = (((orig - info.size) / orig) * 100).toFixed(1);
  console.log(`${file} → ${name}.webp  ${(orig/1024).toFixed(0)}KB → ${(info.size/1024).toFixed(0)}KB  (${savings}% saved)`);
}

console.log('\nDone. Run cleanup separately if needed.');
