import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))

const SOURCE = process.argv[2]
if (!SOURCE) {
  console.error('Usage: node recolor-wave-lottie.mjs <source.json>')
  process.exit(1)
}

const PURPLE = { dark: '#6d28d9', light: '#a855f7' }
const ORANGE = { dark: '#e85d04', light: '#ff8c2a' }
const YELLOW = { dark: '#d4a017', light: '#f5d547' }
const BG = '#1a0b33'

const LAYER_PALETTES = {
  'Liquid 1': PURPLE,
  'Liquid 2': ORANGE,
  'Liquid 3': YELLOW,
}

function hexToRgb(hex) {
  const value = hex.replace('#', '')
  return [
    parseInt(value.slice(0, 2), 16) / 255,
    parseInt(value.slice(2, 4), 16) / 255,
    parseInt(value.slice(4, 6), 16) / 255,
  ]
}

function lerp(a, b, t) {
  return a + (b - a) * t
}

function mixHex(a, b, t) {
  const ar = hexToRgb(a)
  const br = hexToRgb(b)
  return [lerp(ar[0], br[0], t), lerp(ar[1], br[1], t), lerp(ar[2], br[2], t)]
}

function remapGradientStops(stops, palette) {
  const next = [...stops]
  const count = next.length / 4
  for (let i = 0; i < count; i += 1) {
    const t = count === 1 ? 0.5 : i / (count - 1)
    const [r, g, b] = mixHex(palette.dark, palette.light, t)
    next[i * 4 + 1] = r
    next[i * 4 + 2] = g
    next[i * 4 + 3] = b
  }
  return next
}

function recolorLayer(layer) {
  const palette = LAYER_PALETTES[layer.nm]
  if (!palette || !layer.shapes) return

  for (const shape of layer.shapes) {
    const items = shape.it
    if (!items) continue
    for (const item of items) {
      if (item.ty === 'gf' && item.g?.k) {
        const stops = Array.isArray(item.g.k) ? item.g.k : item.g.k.k
        if (!Array.isArray(stops)) continue
        const remapped = remapGradientStops(stops, palette)
        if (Array.isArray(item.g.k)) item.g.k = remapped
        else item.g.k.k = remapped
      }
    }
  }
}

const data = JSON.parse(readFileSync(SOURCE, 'utf8'))

for (const layer of data.assets[0].layers) {
  recolorLayer(layer)
}

const bgLayer = data.layers.find((layer) => layer.nm === 'Shape Layer 5')
if (bgLayer?.shapes?.[0]?.it) {
  for (const item of bgLayer.shapes[0].it) {
    if (item.ty === 'fl' && item.c?.k) {
      const [r, g, b] = hexToRgb(BG)
      item.c.k = [r, g, b, 1]
    }
  }
}

const outPath = join(__dirname, '../src/assets/wave-background.json')
writeFileSync(outPath, JSON.stringify(data))
console.log('Wrote', outPath)
