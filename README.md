# Image Convertor

**Image Convertor** is a privacy-first, purely client-side browser application for converting large batches of images between various formats. The application relies exclusively on browser-based native APIs (like `OffscreenCanvas` and `createImageBitmap`) and Web Workers to encode and decode images.

## Architecture

- **Framework**: Next.js App Router (Static Client Export)
- **Styling**: Tailwind CSS
- **Concurrency**: Web Workers and `hardwareConcurrency`-based worker pools
- **Conversion Engine**: Purely client-side. No image files are ever uploaded to any server.

### Why Client-Side?
Processing images locally provides maximum privacy, allows the application to handle theoretically unlimited image conversions without arbitrary API quotas or costs, and offers near-instantaneous transfers since there is no network latency for image uploading.

### Supported Formats
* **Decoding (Input)**: JPG, PNG, WebP, AVIF, GIF, SVG, BMP, ICO. (Supported via browser's native `createImageBitmap` and `Image` objects).
* **Encoding (Output)**: JPG, PNG, WebP. (Capabilities vary slightly by browser, but WebP and JPG are universally supported for output).

**Note on Format Support**: A format "supported for decoding" means you can drag it in and convert it to something else. A format "supported for encoding" means you can select it as the target format. Some formats (like SVG) can only be decoded and rasterized, but not encoded.

## Setup & Development

1. `npm install`
2. `npm run dev`

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Production Build & Deployment to Vercel

Run `npm run build` to generate an optimized build.
The application is fully compatible with Vercel and functions exclusively as a static/client application. There are no server-side API routes.

## Known Limitations

- **Memory constraints**: Converting 100+ high-resolution images in a single batch might cause older mobile devices to run out of memory, though the worker pool attempts to mitigate this by queueing and revoking object URLs immediately.
- **AVIF Encoding**: Encoding to AVIF natively in the browser is currently unsupported or experimental in many browsers. It is marked disabled for output until WASM encoder fallbacks are integrated.
