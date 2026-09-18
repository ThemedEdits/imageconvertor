import Image from "next/image";
import { Workspace } from "@/components/converter/Workspace";
import * as motion from 'framer-motion/client';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-brand-bg">
      <header className="border-b border-brand-border h-16 flex items-center px-4 sm:px-6 justify-between bg-brand-bg/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <Image
            src="/logo-white.svg"
            alt="Image Convertor Logo"
            width={32}
            height={32}
            className="w-8 h-8"
          />
          <h1 className="hidden sm:block text-brand-primary font-medium tracking-tight text-lg">
            Image Convertor
          </h1>
        </div>
        <nav className="hidden sm:block text-sm text-brand-secondary">
          Private, local image conversion.
        </nav>
      </header>

      <main className="flex-1 flex flex-col items-center py-12 px-4 sm:px-6">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full flex flex-col items-center text-center gap-6 mb-10"
        >
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight text-brand-primary bg-clip-text text-transparent bg-gradient-to-b from-white to-brand-secondary">
            Convert images locally, privately, and without limits.
          </h2>
          <p className="text-brand-secondary text-lg max-w-xl">
            Drop your images here. They are processed entirely within your browser. No servers, no artificial quotas.
          </p>
        </motion.div>
        
        <Workspace />

        {/* Feature Guide Section */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-full max-w-5xl mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 text-left"
        >
          <div className="bg-brand-panel border border-brand-border rounded-2xl p-6 hover:border-brand-primary/50 transition-colors">
            <div className="w-12 h-12 rounded-full bg-brand-primary/10 flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-brand-primary mb-3">Lightning Fast</h3>
            <p className="text-brand-secondary text-sm leading-relaxed">
              Files are converted directly on your device using WebAssembly. Since no data is uploaded or downloaded to a server, the process is instantaneous and doesn't rely on your internet connection.
            </p>
          </div>

          <div className="bg-brand-panel border border-brand-border rounded-2xl p-6 hover:border-brand-primary/50 transition-colors">
            <div className="w-12 h-12 rounded-full bg-brand-primary/10 flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-brand-primary mb-3">100% Private</h3>
            <p className="text-brand-secondary text-sm leading-relaxed">
              Your privacy is guaranteed. Images never leave your computer. Everything happens locally in your web browser, ensuring your sensitive photos and data remain completely confidential.
            </p>
          </div>

          <div className="bg-brand-panel border border-brand-border rounded-2xl p-6 hover:border-brand-primary/50 transition-colors">
            <div className="w-12 h-12 rounded-full bg-brand-primary/10 flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-brand-primary mb-3">Supported Formats</h3>
            <p className="text-brand-secondary text-sm leading-relaxed mb-3">
              We support a wide variety of modern and legacy image formats, allowing seamless conversion between:
            </p>
            <div className="flex flex-wrap gap-2">
              {['JPG', 'PNG', 'WEBP', 'AVIF'].map(fmt => (
                <span key={fmt} className="px-2 py-1 text-xs rounded-md bg-brand-bg border border-brand-border text-brand-primary">
                  {fmt}
                </span>
              ))}
            </div>
          </div>
        </motion.section>

        {/* How it works section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="w-full max-w-4xl mt-24 text-center mb-12"
        >
          <h2 className="text-3xl font-semibold text-brand-primary mb-12">How it works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-1/2 left-[15%] right-[15%] h-0.5 bg-brand-border -z-10 -translate-y-1/2"></div>
            
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-brand-bg border-2 border-brand-primary text-brand-primary flex items-center justify-center font-bold text-xl mb-4 shadow-[0_0_15px_rgba(255,255,255,0.05)]">1</div>
              <h4 className="font-medium text-brand-primary mb-2">Upload</h4>
              <p className="text-brand-secondary text-sm text-center">Drag and drop your images or click to select them from your device.</p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-brand-bg border-2 border-brand-primary text-brand-primary flex items-center justify-center font-bold text-xl mb-4 shadow-[0_0_15px_rgba(255,255,255,0.05)]">2</div>
              <h4 className="font-medium text-brand-primary mb-2">Configure</h4>
              <p className="text-brand-secondary text-sm text-center">Select your desired output format (like WebP or AVIF) and adjust quality settings.</p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-brand-bg border-2 border-brand-primary text-brand-primary flex items-center justify-center font-bold text-xl mb-4 shadow-[0_0_15px_rgba(255,255,255,0.05)]">3</div>
              <h4 className="font-medium text-brand-primary mb-2">Convert & Download</h4>
              <p className="text-brand-secondary text-sm text-center">Click convert and instantly download your processed images individually or as a ZIP.</p>
            </div>
          </div>
        </motion.section>
      </main>

      <footer className="w-full border-t border-brand-border bg-brand-panel/50 backdrop-blur-sm flex flex-col items-center justify-center py-8 gap-4 mt-auto">
        <div className="text-sm text-brand-secondary">
          &copy; {new Date().getFullYear()} Image Convertor. All processing is local.
        </div>
        <div className="text-sm text-brand-secondary flex items-center gap-1.5 bg-brand-bg px-4 py-2 rounded-full border border-brand-border shadow-sm hover:border-brand-primary/30 transition-colors">
          Designed and Developed by 
          <a 
            href="https://themededits.vercel.app/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-brand-primary font-medium hover:underline hover:text-white transition-colors flex items-center gap-1"
          >
            Themed Edits
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
      </footer>
    </div>
  );
}
