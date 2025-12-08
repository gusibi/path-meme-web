// 运行: node scripts/generate-pwa-icons.js
// 需要先安装 sharp: npm install sharp --save-dev

import sharp from 'sharp';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, '..', 'public');

// Path Meme 主题色
const THEME_COLOR = '#EE3524';

// 创建艺术字体 P 的 SVG 图标
function createIconSvg(size) {
  const radius = Math.floor(size * 0.18);
  const fontSize = Math.floor(size * 0.65);
  const yPos = Math.floor(size * 0.72);
  
  // 使用 Georgia/Serif 字体，带有优雅的斜体效果
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}">
    <defs>
      <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:${THEME_COLOR};stop-opacity:1" />
        <stop offset="100%" style="stop-color:#D91E18;stop-opacity:1" />
      </linearGradient>
      <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="${size * 0.02}" stdDeviation="${size * 0.015}" flood-color="#000" flood-opacity="0.2"/>
      </filter>
    </defs>
    <rect width="${size}" height="${size}" rx="${radius}" fill="url(#bgGradient)"/>
    <text 
      x="${size/2}" 
      y="${yPos}" 
      font-family="Georgia, 'Times New Roman', serif" 
      font-size="${fontSize}" 
      font-weight="bold"
      font-style="italic"
      fill="white" 
      text-anchor="middle"
      filter="url(#shadow)"
    >P</text>
  </svg>`;
}

// 创建 maskable 图标（需要更大的安全区域）
function createMaskableIconSvg(size) {
  const radius = Math.floor(size * 0.18);
  const fontSize = Math.floor(size * 0.5); // 稍小一点
  const yPos = Math.floor(size * 0.68);
  
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}">
    <defs>
      <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:${THEME_COLOR};stop-opacity:1" />
        <stop offset="100%" style="stop-color:#D91E18;stop-opacity:1" />
      </linearGradient>
    </defs>
    <rect width="${size}" height="${size}" fill="url(#bgGradient)"/>
    <text 
      x="${size/2}" 
      y="${yPos}" 
      font-family="Georgia, 'Times New Roman', serif" 
      font-size="${fontSize}" 
      font-weight="bold"
      font-style="italic"
      fill="white" 
      text-anchor="middle"
    >P</text>
  </svg>`;
}

async function generateIcons() {
  const icons = [
    { name: 'pwa-192x192.png', size: 192, maskable: false },
    { name: 'pwa-512x512.png', size: 512, maskable: false },
    { name: 'pwa-maskable-512x512.png', size: 512, maskable: true },
    { name: 'apple-touch-icon.png', size: 180, maskable: false },
  ];

  for (const icon of icons) {
    const svg = icon.maskable ? createMaskableIconSvg(icon.size) : createIconSvg(icon.size);
    await sharp(Buffer.from(svg))
      .png()
      .toFile(join(publicDir, icon.name));
    console.log(`Generated ${icon.name}`);
  }

  // 同时生成 SVG 版本用于 mask-icon
  const svgContent = createIconSvg(512);
  const fs = await import('fs/promises');
  await fs.writeFile(join(publicDir, 'pwa-512x512.svg'), svgContent);
  console.log('Generated pwa-512x512.svg');

  console.log('All PWA icons generated!');
}

generateIcons().catch(console.error);
