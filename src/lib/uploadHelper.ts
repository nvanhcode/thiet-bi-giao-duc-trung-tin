import fs from "fs/promises";
import path from "path";
import sharp from "sharp";

export interface UploadResult {
  url: string;
  originalSize: number;
  compressedSize: number;
  savedPercent: number;
  width: number;
  height: number;
}

export async function processAndSaveImage(
  buffer: Buffer,
  originalFilename: string
): Promise<UploadResult> {
  const uploadsDir = path.join(process.cwd(), "public", "uploads");

  // Ensure public/uploads directory exists
  try {
    await fs.mkdir(uploadsDir, { recursive: true });
  } catch (err) {
    // Directory exists
  }

  // Clean filename
  const sanitizedName = originalFilename
    .toLowerCase()
    .replace(/\.[^/.]+$/, "") // remove extension
    .replace(/[^a-z0-9]/g, "-") // sanitize special chars
    .substring(0, 30);

  const timestamp = Date.now();
  const filename = `${timestamp}-${sanitizedName}.webp`;
  const outputPath = path.join(uploadsDir, filename);

  const originalSize = buffer.length;

  // Process image with Sharp
  const processedImage = sharp(buffer)
    .resize({
      width: 1920,
      withoutEnlargement: true,
      fit: "inside",
    })
    .webp({ quality: 80 });

  const metadata = await processedImage.metadata();
  const outputBuffer = await processedImage.toBuffer();

  await fs.writeFile(outputPath, outputBuffer);

  const compressedSize = outputBuffer.length;
  const savedPercent = originalSize > 0
    ? Math.max(0, Math.round(((originalSize - compressedSize) / originalSize) * 100))
    : 0;

  return {
    url: `/uploads/${filename}`,
    originalSize,
    compressedSize,
    savedPercent,
    width: metadata.width || 0,
    height: metadata.height || 0,
  };
}
