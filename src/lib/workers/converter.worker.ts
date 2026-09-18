import { ImageFormat, FORMAT_REGISTRY } from '../codecs/FormatRegistry';

export interface ConversionRequest {
  id: string;
  file: File;
  targetFormat: ImageFormat;
  quality?: number;
  backgroundColor?: string; // used when target doesn't support alpha
}

export interface ConversionResponse {
  id: string;
  success: boolean;
  blob?: Blob;
  error?: string;
}

// In a real worker, this code runs in the worker context.
// Webpack/Next.js automatically compiles it when initialized via new Worker()

self.addEventListener('message', async (event: MessageEvent<ConversionRequest>) => {
  const { id, file, targetFormat, quality, backgroundColor } = event.data;

  try {
    const targetConfig = FORMAT_REGISTRY[targetFormat];
    
    if (!targetConfig || !targetConfig.canEncode) {
      throw new Error(`Format ${targetConfig?.name || targetFormat} is not supported for encoding.`);
    }

    // Decode image
    // For SVG, we might need a different approach since createImageBitmap doesn't always support SVG well in some browsers,
    // but for most browsers it works if the SVG has physical dimensions. 
    // We'll try createImageBitmap first.
    let bitmap: ImageBitmap;
    try {
      bitmap = await createImageBitmap(file);
    } catch (e) {
      // If SVG fails or something else, we might need to fallback to Blob URL + Image in main thread,
      // but in worker we don't have Image. We will assume createImageBitmap works for standard raster formats.
      console.error(e);
      throw new Error("Failed to decode image. Format might be unsupported or file corrupted.");
    }

    const { width, height } = bitmap;

    // Create OffscreenCanvas
    const canvas = new OffscreenCanvas(width, height);
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      throw new Error("Failed to get 2D context from OffscreenCanvas.");
    }

    // Handle background if target format doesn't support alpha
    if (!targetConfig.supportsAlpha) {
      ctx.fillStyle = backgroundColor || '#FFFFFF'; // Default to white
      ctx.fillRect(0, 0, width, height);
    }

    // Draw the image onto the canvas
    ctx.drawImage(bitmap, 0, 0);

    // Free the bitmap memory
    bitmap.close();

    // Determine target mime type and quality
    const mimeType = targetConfig.mimeTypes[0];
    // quality is between 0 and 1
    const encoderQuality = quality !== undefined ? quality / 100 : 0.8;

    // Convert to target Blob
    const outputBlob = await canvas.convertToBlob({
      type: mimeType,
      quality: targetConfig.supportsQuality ? encoderQuality : undefined,
    });

    // Strict mime type check to ensure the browser actually encoded to the requested format
    // (Browsers may silently fallback to image/png if the requested type is unsupported)
    if (outputBlob.type !== mimeType) {
      throw new Error(`Your browser does not natively support encoding to ${targetConfig.name}.`);
    }

    // Send the blob back
    self.postMessage({
      id,
      success: true,
      blob: outputBlob
    } as ConversionResponse);
    
  } catch (err: any) {
    self.postMessage({
      id,
      success: false,
      error: err.message || "Unknown error during conversion"
    } as ConversionResponse);
  }
});
