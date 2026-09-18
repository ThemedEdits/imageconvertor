import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://imageconvertor.vercel.app'), // Update with actual domain
  title: {
    default: "Image Convertor | Private Local Image Conversion",
    template: "%s | Image Convertor"
  },
  description: "Free, private, and unlimited local image conversion directly in your browser. Convert JPG, PNG, WebP, AVIF, SVG, and more without uploading files to a server.",
  keywords: ["image converter", "local image conversion", "private image converter", "batch image convert", "jpg", "png", "webp", "avif", "free image converter", "browser image converter", "secure image conversion"],
  authors: [{ name: "Themed Edits", url: "https://themededits.vercel.app/" }],
  creator: "Themed Edits",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "Image Convertor | Private Local Image Conversion",
    description: "Free, private, and unlimited local image conversion directly in your browser.",
    siteName: "Image Convertor",
    images: [
      {
        url: "/preview-image.png", // User to place this in public folder
        width: 1200,
        height: 630,
        alt: "Image Convertor Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Image Convertor | Private Local Image Conversion",
    description: "Free, private, and unlimited local image conversion directly in your browser.",
    images: ["/preview-image.png"],
    creator: "@themededits", // Update if you have a Twitter handle
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  appleWebApp: {
    title: 'Image Convertor',
    statusBarStyle: 'black-translucent',
  },
  manifest: '/site.webmanifest',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
