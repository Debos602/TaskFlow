import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'
import pngToIco from 'png-to-ico'

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const sourcePath = path.join(projectRoot, 'scripts', 'task-icon.svg')
const publicPath = path.join(projectRoot, 'public')

await mkdir(publicPath, { recursive: true })
const source = await readFile(sourcePath)

const renderPng = (size) => sharp(source).resize(size, size).png()

await renderPng(192).toFile(path.join(publicPath, 'pwa-192x192.png'))
const maskablePng = await renderPng(512).toBuffer()
await sharp(maskablePng).toFile(path.join(publicPath, 'pwa-512x512.png'))
await sharp(maskablePng).resize(180, 180).toFile(path.join(publicPath, 'apple-touch-icon.png'))
const faviconPngs = await Promise.all([16, 32, 48].map((size) => renderPng(size).toBuffer()))
await writeFile(path.join(publicPath, 'favicon.ico'), await pngToIco(faviconPngs))

await writeFile(path.join(publicPath, 'masked-icon.svg'), source)

console.log('Generated PWA icons in public/')
