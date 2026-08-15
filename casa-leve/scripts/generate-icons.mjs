/**
 * Gera os icones PNG da PWA sem dependencias externas.
 * Desenha uma casa simples sobre fundo navy e escreve o PNG a mao
 * (cabecalho + IDAT com zlib) para nao precisar de canvas nem sharp.
 */
import { deflateSync } from 'node:zlib';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const OUT_DIR = resolve(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'icons');

const NAVY = [31, 48, 73];
const CREAM = [250, 248, 245];
const GREEN = [74, 157, 110];

function crc32(buffer) {
  let crc = ~0;
  for (const byte of buffer) {
    crc ^= byte;
    for (let i = 0; i < 8; i += 1) {
      crc = (crc >>> 1) ^ (0xedb88320 & -(crc & 1));
    }
  }
  return ~crc >>> 0;
}

function chunk(type, data) {
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type, 'latin1'), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body));
  return Buffer.concat([length, body, crc]);
}

function encodePng(size, pixelAt) {
  const raw = Buffer.alloc((size * 3 + 1) * size);
  let offset = 0;
  for (let y = 0; y < size; y += 1) {
    raw[offset] = 0; // filtro "none"
    offset += 1;
    for (let x = 0; x < size; x += 1) {
      const [r, g, b] = pixelAt(x, y);
      raw[offset] = r;
      raw[offset + 1] = g;
      raw[offset + 2] = b;
      offset += 3;
    }
  }

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; // bits por canal
  ihdr[9] = 2; // truecolor
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

/** Casa: telhado triangular, corpo quadrado e uma porta verde. */
function houseIcon(size, padding) {
  const inner = size - padding * 2;
  const roofTop = padding + inner * 0.12;
  const roofBottom = padding + inner * 0.46;
  const bodyTop = roofBottom;
  const bodyBottom = padding + inner * 0.86;
  const bodyLeft = padding + inner * 0.2;
  const bodyRight = padding + inner * 0.8;
  const doorLeft = padding + inner * 0.42;
  const doorRight = padding + inner * 0.58;
  const doorTop = padding + inner * 0.6;
  const center = size / 2;

  return (x, y) => {
    const inRoof =
      y >= roofTop &&
      y <= roofBottom &&
      Math.abs(x - center) <= ((y - roofTop) / (roofBottom - roofTop)) * (inner * 0.36);
    const inBody = y > bodyTop && y <= bodyBottom && x >= bodyLeft && x <= bodyRight;
    const inDoor = y >= doorTop && y <= bodyBottom && x >= doorLeft && x <= doorRight;

    if (inDoor && (inBody || inRoof)) return GREEN;
    if (inRoof || inBody) return CREAM;
    return NAVY;
  };
}

const TARGETS = [
  { file: 'icon-192.png', size: 192, padding: 20 },
  { file: 'icon-512.png', size: 512, padding: 54 },
  { file: 'icon-maskable-512.png', size: 512, padding: 96 },
  { file: 'apple-touch-icon.png', size: 180, padding: 18 },
];

mkdirSync(OUT_DIR, { recursive: true });
for (const target of TARGETS) {
  const png = encodePng(target.size, houseIcon(target.size, target.padding));
  writeFileSync(resolve(OUT_DIR, target.file), png);
  console.log(`✓ ${target.file} (${target.size}px)`);
}
