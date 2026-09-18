import Image from "next/image";
import { Workspace } from "@/components/converter/Workspace";
import * as motion from 'framer-motion/client';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
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
      </main>

      <footer className="h-16 border-t border-brand-border flex items-center justify-center text-sm text-brand-secondary shrink-0 mt-auto">
        &copy; {new Date().getFullYear()} Image Convertor. All processing is local.
      </footer>
    </div>
  );
}
