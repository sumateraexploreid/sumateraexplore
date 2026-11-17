import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const INPUT = '/Users/ayhoo/.gemini/antigravity/brain/f4e11a24-c5a8-410f-a2bd-1bc8f9942b9c/.user_uploaded/media_1794884492241_c0b0d295.jpg';
const LOGO_DIR = path.resolve('public/images/logo');
const ICONS_DIR = path.resolve('public/icons');

fs.mkdirSync(LOGO_DIR, { recursive: true });
fs.mkdirSync(ICONS_DIR, { recursive: true });

async function main() {
  const meta = await sharp(INPUT).metadata();
  const { width, height } = meta;

  // 1. Load raw pixels to perform BFS flood-fill transparency on outer white pixels
  const { data, info } = await sharp(INPUT).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const rawWidth = info.width;
  const rawHeight = info.height;
  const channels = info.channels; // 4 (RGBA)

  // Visited array for BFS
  const visited = new Uint8Array(rawWidth * rawHeight);
  const queue = [];

  const isNearWhite = (idx) => {
    const r = data[idx];
    const g = data[idx + 1];
    const b = data[idx + 2];
    return r >= 240 && g >= 240 && b >= 240;
  };

  // Push all border pixels to queue if they are near-white
  for (let x = 0; x < rawWidth; x++) {
    const topIdx = (0 * rawWidth + x) * channels;
    if (isNearWhite(topIdx)) {
      visited[0 * rawWidth + x] = 1;
      queue.push(x, 0);
    }
    const bottomIdx = ((rawHeight - 1) * rawWidth + x) * channels;
    if (isNearWhite(bottomIdx)) {
      visited[(rawHeight - 1) * rawWidth + x] = 1;
      queue.push(x, rawHeight - 1);
    }
  }

  for (let y = 0; y < rawHeight; y++) {
    const leftIdx = (y * rawWidth + 0) * channels;
    if (isNearWhite(leftIdx) && !visited[y * rawWidth + 0]) {
      visited[y * rawWidth + 0] = 1;
      queue.push(0, y);
    }
    const rightIdx = (y * rawWidth + (rawWidth - 1)) * channels;
    if (isNearWhite(rightIdx) && !visited[y * rawWidth + (rawWidth - 1)]) {
      visited[y * rawWidth + (rawWidth - 1)] = 1;
      queue.push(rawWidth - 1, y);
    }
  }

  // BFS
  let head = 0;
  while (head < queue.length) {
    const cx = queue[head++];
    const cy = queue[head++];

    const neighbors = [
      [cx + 1, cy],
      [cx - 1, cy],
      [cx, cy + 1],
      [cx, cy - 1],
    ];

    for (const [nx, ny] of neighbors) {
      if (nx >= 0 && nx < rawWidth && ny >= 0 && ny < rawHeight) {
        const npos = ny * rawWidth + nx;
        if (!visited[npos]) {
          const nidx = npos * channels;
          if (isNearWhite(nidx)) {
            visited[npos] = 1;
            queue.push(nx, ny);
          }
        }
      }
    }
  }

  // Create transparent buffer where visited pixels have alpha = 0
  const transparentData = Buffer.from(data);
  for (let i = 0; i < visited.length; i++) {
    if (visited[i]) {
      transparentData[i * channels + 3] = 0; // Alpha = 0
    }
  }

  // Bounding box of non-transparent content
  let minX = rawWidth, maxX = 0, minY = rawHeight, maxY = 0;
  for (let y = 0; y < rawHeight; y++) {
    for (let x = 0; x < rawWidth; x++) {
      const idx = (y * rawWidth + x) * channels;
      if (transparentData[idx + 3] > 0) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  console.log('Artwork bounds:', { minX, maxX, minY, maxY, w: maxX - minX, h: maxY - minY });

  // Save the full transparent raw image
  const transparentFull = sharp(transparentData, {
    raw: { width: rawWidth, height: rawHeight, channels: 4 },
  });

  // Extract trimmed content with comfortable padding (32px)
  const pad = 24;
  const cropLeft = Math.max(0, minX - pad);
  const cropTop = Math.max(0, minY - pad);
  const cropWidth = Math.min(rawWidth - cropLeft, (maxX - minX) + pad * 2);
  const cropHeight = Math.min(rawHeight - cropTop, (maxY - minY) + pad * 2);

  const croppedTransparent = transparentFull.clone().extract({
    left: cropLeft,
    top: cropTop,
    width: cropWidth,
    height: cropHeight,
  });

  // 1. Save Full Transparent Logo (PNG and WebP)
  await croppedTransparent.clone().png({ quality: 95 }).toFile(path.join(LOGO_DIR, 'logo-transparent.png'));
  await croppedTransparent.clone().webp({ quality: 95 }).toFile(path.join(LOGO_DIR, 'logo-transparent.webp'));
  console.log('Saved logo-transparent.png and .webp');

  // 2. Save Solid White Background Full Logo (trimmed & centered)
  const fullSolid = sharp(INPUT).extract({
    left: cropLeft,
    top: cropTop,
    width: cropWidth,
    height: cropHeight,
  });
  await fullSolid.clone().png({ quality: 95 }).toFile(path.join(LOGO_DIR, 'logo.png'));
  await fullSolid.clone().webp({ quality: 95 }).toFile(path.join(LOGO_DIR, 'logo.webp'));
  console.log('Saved logo.png and logo.webp');

  // 3. Extract Emblem/Mark (the top mountain + rumah adat + tree, y from minY to 505)
  const markTop = Math.max(0, minY - 10);
  const markHeight = Math.min(rawHeight - markTop, 505 - minY + 20);
  const markWidth = cropWidth;

  // Solid white mark
  const markSolid = sharp(INPUT).extract({
    left: cropLeft,
    top: markTop,
    width: cropWidth,
    height: markHeight,
  });

  // Transparent mark
  const markTransparent = transparentFull.clone().extract({
    left: cropLeft,
    top: markTop,
    width: cropWidth,
    height: markHeight,
  });

  const squareDim = Math.max(markWidth, markHeight) + 30;

  // Center mark in a square white canvas
  const markSquare = await sharp({
    create: {
      width: squareDim,
      height: squareDim,
      channels: 4,
      background: { r: 255, g: 255, b: 255, alpha: 1 },
    },
  })
    .composite([
      {
        input: await markSolid.png().toBuffer(),
        gravity: 'center',
      },
    ])
    .png()
    .toBuffer();

  await sharp(markSquare).resize(512, 512).png().toFile(path.join(LOGO_DIR, 'logo-mark.png'));
  await sharp(markSquare).resize(512, 512).webp().toFile(path.join(LOGO_DIR, 'logo-mark.webp'));

  // Center mark in a square transparent canvas
  const markTransparentSquare = await sharp({
    create: {
      width: squareDim,
      height: squareDim,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite([
      {
        input: await markTransparent.png().toBuffer(),
        gravity: 'center',
      },
    ])
    .png()
    .toBuffer();

  await sharp(markTransparentSquare).resize(512, 512).png().toFile(path.join(LOGO_DIR, 'logo-mark-transparent.png'));
  await sharp(markTransparentSquare).resize(512, 512).webp().toFile(path.join(LOGO_DIR, 'logo-mark-transparent.webp'));
  console.log('Saved logo-mark.png, logo-mark-transparent.png and .webp');

  // 4. Square App Badge (Full logo centered on crisp white square with rounded corners/squircle)
  const badgeSize = 512;
  const fitLogo = await sharp(path.join(LOGO_DIR, 'logo.png'))
    .resize(badgeSize - 40, badgeSize - 40, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } })
    .png()
    .toBuffer();

  const badgeBuffer = await sharp({
    create: {
      width: badgeSize,
      height: badgeSize,
      channels: 4,
      background: { r: 255, g: 255, b: 255, alpha: 1 },
    },
  })
    .composite([
      {
        input: fitLogo,
        gravity: 'center',
      },
    ])
    .png()
    .toBuffer();

  await sharp(badgeBuffer).png().toFile(path.join(LOGO_DIR, 'logo-badge.png'));
  await sharp(badgeBuffer).webp().toFile(path.join(LOGO_DIR, 'logo-badge.webp'));
  console.log('Saved logo-badge.png and logo-badge.webp');

  // 5. Generate Favicons and App Icons
  await sharp(badgeBuffer).resize(64, 64).png().toFile('public/favicon.png');
  await sharp(badgeBuffer).resize(192, 192).png().toFile('public/icon-192.png');
  await sharp(badgeBuffer).resize(512, 512).png().toFile('public/icon-512.png');

  const pwaSizes = [72, 96, 128, 144, 152, 192, 384, 512];
  for (const size of pwaSizes) {
    const resized = sharp(badgeBuffer).resize(size, size);
    await resized.clone().png().toFile(path.join(ICONS_DIR, `icon-${size}x${size}.png`));
    await resized.clone().webp().toFile(path.join(ICONS_DIR, `icon-${size}x${size}.webp`));
  }
  console.log('Saved all PWA and favicon icons!');
}

main().catch(console.error);
