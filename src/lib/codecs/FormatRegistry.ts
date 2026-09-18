export type ImageFormat = 
  | 'jpeg' 
  | 'png' 
  | 'webp' 
  | 'avif' 
  | 'gif' 
  | 'svg' 
  | 'bmp' 
  | 'ico' 
  | 'tiff';

export interface FormatCapabilities {
  format: ImageFormat;
  name: string;
  extensions: string[];
  mimeTypes: string[];
  canDecode: boolean;
  canEncode: boolean;
  supportsAlpha: boolean;
  supportsAnimation: boolean;
  supportsQuality: boolean;
  supportsLossless: boolean;
}

export const FORMAT_REGISTRY: Record<ImageFormat, FormatCapabilities> = {
  jpeg: {
    format: 'jpeg',
    name: 'JPEG',
    extensions: ['jpg', 'jpeg'],
    mimeTypes: ['image/jpeg'],
    canDecode: true,
    canEncode: true,
    supportsAlpha: false,
    supportsAnimation: false,
    supportsQuality: true,
    supportsLossless: false,
  },
  png: {
    format: 'png',
    name: 'PNG',
    extensions: ['png'],
    mimeTypes: ['image/png'],
    canDecode: true,
    canEncode: true,
    supportsAlpha: true,
    supportsAnimation: false,
    supportsQuality: false,
    supportsLossless: true,
  },
  webp: {
    format: 'webp',
    name: 'WebP',
    extensions: ['webp'],
    mimeTypes: ['image/webp'],
    canDecode: true,
    canEncode: true,
    supportsAlpha: true,
    supportsAnimation: true,
    supportsQuality: true,
    supportsLossless: true,
  },
  avif: {
    format: 'avif',
    name: 'AVIF',
    extensions: ['avif'],
    mimeTypes: ['image/avif'],
    canDecode: true, 
    canEncode: true,
    supportsAlpha: true,
    supportsAnimation: true,
    supportsQuality: true,
    supportsLossless: true,
  },
  gif: {
    format: 'gif',
    name: 'GIF',
    extensions: ['gif'],
    mimeTypes: ['image/gif'],
    canDecode: true,
    canEncode: true, 
    supportsAlpha: true,
    supportsAnimation: true,
    supportsQuality: false,
    supportsLossless: true,
  },
  svg: {
    format: 'svg',
    name: 'SVG',
    extensions: ['svg'],
    mimeTypes: ['image/svg+xml'],
    canDecode: true, 
    canEncode: false, // Cannot encode to SVG from raster
    supportsAlpha: true,
    supportsAnimation: true,
    supportsQuality: false,
    supportsLossless: true,
  },
  bmp: {
    format: 'bmp',
    name: 'BMP',
    extensions: ['bmp'],
    mimeTypes: ['image/bmp'],
    canDecode: true, 
    canEncode: true,
    supportsAlpha: false,
    supportsAnimation: false,
    supportsQuality: false,
    supportsLossless: true,
  },
  ico: {
    format: 'ico',
    name: 'ICO',
    extensions: ['ico'],
    mimeTypes: ['image/x-icon', 'image/vnd.microsoft.icon'],
    canDecode: true, 
    canEncode: true,
    supportsAlpha: true,
    supportsAnimation: false,
    supportsQuality: false,
    supportsLossless: true,
  },
  tiff: {
    format: 'tiff',
    name: 'TIFF',
    extensions: ['tiff', 'tif'],
    mimeTypes: ['image/tiff'],
    canDecode: true, 
    canEncode: true,
    supportsAlpha: true,
    supportsAnimation: false,
    supportsQuality: false,
    supportsLossless: true,
  }
};

export const getFormatByExtension = (filename: string): ImageFormat | null => {
  const ext = filename.split('.').pop()?.toLowerCase();
  if (!ext) return null;
  
  for (const [key, format] of Object.entries(FORMAT_REGISTRY)) {
    if (format.extensions.includes(ext)) {
      return key as ImageFormat;
    }
  }
  return null;
};

export const getFormatByMimeType = (mime: string): ImageFormat | null => {
  for (const [key, format] of Object.entries(FORMAT_REGISTRY)) {
    if (format.mimeTypes.includes(mime)) {
      return key as ImageFormat;
    }
  }
  return null;
};
