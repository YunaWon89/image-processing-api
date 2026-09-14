import path from "path";
import fs from "fs/promises";
import fsSync from "fs";
import { pipeline } from "stream/promises";
import { sharp, SupportedFormat } from "../config/sharp";
import {
  getCachedImage,
  setCachedImage,
} from "../config/redis";

const uploadsDir = path.join(process.cwd(), "uploads");
const processedDir = path.join(process.cwd(), "processed");

export interface ProcessOptions {
  width?: number;
  height?: number;
  fit?: "cover" | "contain" | "fill" | "inside" | "outside";
  format?: SupportedFormat;
  quality?: number;
  sharpen?: boolean;
}
function createCacheKey(
  filename: string,
  options: ProcessOptions,
): string {
  return `image:${filename}:${JSON.stringify(options)}`;
}
export interface ProcessResult {
  filename: string;
  path: string;
  width?: number;
  height?: number;
  format?: string;
  size: number;
}

export interface ImageMetadata {
  format?: string;
  width?: number;
  height?: number;
  space?: string;
  channels?: number;
  depth?: string;
  density?: number;
  hasAlpha?: boolean;
  size?: number;
}

export interface ThumbnailResult {
  filename: string;
  path: string;
  width?: number;
  height?: number;
  size: number;
}

async function ensureProcessedDir(): Promise<void> {
  await fs.mkdir(processedDir, { recursive: true });
}

export async function processImage(
  filename: string,
  options: ProcessOptions,
): Promise<ProcessResult> {
  const inputPath = path.join(uploadsDir, filename);

  await fs.access(inputPath);
  await ensureProcessedDir();
  const cacheKey = createCacheKey(filename, options);

const cachedFilename = await getCachedImage(cacheKey);

if (cachedFilename) {
  const cachedName = cachedFilename.toString();
  const cachedPath = path.join(processedDir, cachedName);

  try {
    const stats = await fs.stat(cachedPath);

    console.log("Cache HIT:", cacheKey);

    return {
      filename: cachedName,
      path: cachedPath,
      size: stats.size,
    };
  } catch {
    console.log("Cached file not found, processing image again");
  }
}

console.log("Cache MISS:", cacheKey);

  const outputFormat = options.format ?? "webp";

  const outputFilename = `${path.parse(filename).name}-${Date.now()}.${outputFormat}`;

  const outputPath = path.join(processedDir, outputFilename);

  let image = sharp(inputPath);

  if (options.width || options.height) {
    image = image.resize({
      width: options.width,
      height: options.height,
      fit: options.fit ?? "cover",
    });
  }

  if (options.sharpen) {
    image = image.sharpen();
  }

  switch (outputFormat) {
    case "jpeg":
      image = image.jpeg({
        quality: options.quality ?? 80,
      });
      break;

    case "png":
      image = image.png({
        quality: options.quality ?? 80,
      });
      break;

    case "webp":
      image = image.webp({
        quality: options.quality ?? 80,
      });
      break;

    case "avif":
      image = image.avif({
        quality: options.quality ?? 80,
      });
      break;
  }

  const result = await image.toFile(outputPath);
await setCachedImage(
  cacheKey,
  Buffer.from(outputFilename),
);
  return {
    filename: outputFilename,
    path: outputPath,
    width: result.width,
    height: result.height,
    format: outputFormat,
    size: result.size,
  };
}
export async function processImageStream(
  filename: string,
  width = 800,
): Promise<ProcessResult> {
  const inputPath = path.join(uploadsDir, filename);

  await fs.access(inputPath);
  await ensureProcessedDir();

  const outputFilename = `${path.parse(filename).name}-stream-${Date.now()}.webp`;
  const outputPath = path.join(processedDir, outputFilename);

  const readStream = fsSync.createReadStream(inputPath);

  const transformer = sharp()
    .resize({
      width,
      withoutEnlargement: true,
    })
    .webp({
      quality: 80,
    });

  const writeStream = fsSync.createWriteStream(outputPath);

  await pipeline(
    readStream,
    transformer,
    writeStream,
  );

  const metadata = await sharp(outputPath).metadata();
  const stats = await fs.stat(outputPath);

  return {
    filename: outputFilename,
    path: outputPath,
    width: metadata.width,
    height: metadata.height,
    format: "webp",
    size: stats.size,
  };
}
export async function getImageMetadata(
  filename: string,
): Promise<ImageMetadata> {
  const inputPath = path.join(uploadsDir, filename);

  await fs.access(inputPath);

  const metadata = await sharp(inputPath).metadata();

  return {
    format: metadata.format,
    width: metadata.width,
    height: metadata.height,
    space: metadata.space,
    channels: metadata.channels,
    depth: metadata.depth,
    density: metadata.density,
    hasAlpha: metadata.hasAlpha,
  };
}

export async function createThumbnail(
  filename: string,
  width = 300,
  height = 300,
): Promise<ThumbnailResult> {
  const inputPath = path.join(uploadsDir, filename);

  await fs.access(inputPath);
  await ensureProcessedDir();

  const outputFilename = `${path.parse(filename).name}-thumbnail-${Date.now()}.webp`;

  const outputPath = path.join(processedDir, outputFilename);

  const result = await sharp(inputPath)
    .resize({
      width,
      height,
      fit: "cover",
      position: "center",
    })
    .webp({ quality: 80 })
    .toFile(outputPath);

  return {
    filename: outputFilename,
    path: outputPath,
    width: result.width,
    height: result.height,
    size: result.size,
  };
}

export async function createResponsiveImages(
  filename: string,
  sizes: number[] = [320, 640, 1024, 1600],
): Promise<ThumbnailResult[]> {
  const inputPath = path.join(uploadsDir, filename);

  await fs.access(inputPath);
  await ensureProcessedDir();

  const results: ThumbnailResult[] = [];

  for (const width of sizes) {
    const outputFilename = `${path.parse(filename).name}-${width}w-${Date.now()}.webp`;

    const outputPath = path.join(processedDir, outputFilename);

    const result = await sharp(inputPath)
      .resize({
        width,
        withoutEnlargement: true,
      })
      .webp({ quality: 80 })
      .toFile(outputPath);

    results.push({
      filename: outputFilename,
      path: outputPath,
      width: result.width,
      height: result.height,
      size: result.size,
    });
  }

  return results;
}
export interface WatermarkResult {
  filename: string;
  path: string;
  width?: number;
  height?: number;
  size: number;
}

export async function addWatermark(
  filename: string,
  text = 'Image Processing API'
): Promise<WatermarkResult> {
  const inputPath = path.join(uploadsDir, filename);

  await fs.access(inputPath);
  await ensureProcessedDir();

  const outputFilename =
    `${path.parse(filename).name}-watermark-${Date.now()}.webp`;

  const outputPath = path.join(processedDir, outputFilename);

  const metadata = await sharp(inputPath).metadata();

  const width = metadata.width ?? 800;
  const height = metadata.height ?? 600;

  const watermarkSvg = `
    <svg width="${width}" height="${height}">
      <style>
        .watermark {
          fill: white;
          font-size: 32px;
          font-family: Arial, sans-serif;
          font-weight: bold;
        }
      </style>
      <text
        x="${width - 20}"
        y="${height - 20}"
        text-anchor="end"
        class="watermark"
        opacity="0.7"
      >
        ${text}
      </text>
    </svg>
  `;

  const result = await sharp(inputPath)
    .composite([
      {
        input: Buffer.from(watermarkSvg),
        top: 0,
        left: 0
      }
    ])
    .webp({ quality: 80 })
    .toFile(outputPath);

  return {
    filename: outputFilename,
    path: outputPath,
    width: result.width,
    height: result.height,
    size: result.size
  };
}