'use client';
import { useState } from 'react';
import { useConversionQueue } from '@/lib/useConversionQueue';
import { DropZone } from './DropZone';
import { FileCard } from './FileCard';
import { FORMAT_REGISTRY, ImageFormat } from '@/lib/codecs/FormatRegistry';
import { CustomSelect } from '../ui/CustomSelect';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings2, Play, DownloadCloud, Trash2, Loader2 } from 'lucide-react';

export function Workspace() {
  const queue = useConversionQueue();
  const [globalFormat, setGlobalFormat] = useState<ImageFormat>('webp');
  const [globalQuality, setGlobalQuality] = useState<number>(80);
  const [globalBg, setGlobalBg] = useState<string>('#FFFFFF');

  const handleGlobalFormatChange = (val: string) => {
    const newFormat = val as ImageFormat;
    setGlobalFormat(newFormat);
    queue.applyGlobalSettings(newFormat, globalQuality, globalBg);
  };

  const handleGlobalQualityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    setGlobalQuality(val);
    queue.applyGlobalSettings(globalFormat, val, globalBg);
  };

  const handleGlobalBgChange = (val: string) => {
    setGlobalBg(val);
    queue.applyGlobalSettings(globalFormat, globalQuality, val);
  };

  const hasItems = queue.items.length > 0;
  const isConverting = queue.items.some(i => i.status === 'processing');
  const allCompleted = queue.items.every(i => i.status === 'completed' || i.status === 'failed') && hasItems && !isConverting;

  const handleDownloadAll = async () => {
    const JSZip = (await import('jszip')).default;
    const zip = new JSZip();
    
    let added = 0;
    const nameTracker = new Set<string>();

    queue.items.forEach(item => {
      if (item.status === 'completed' && item.resultBlob) {
        const nameParts = item.file.name.split('.');
        nameParts.pop();
        let baseName = nameParts.join('.');
        
        let finalName = `${baseName}.${item.targetFormat}`;
        let counter = 1;
        while (nameTracker.has(finalName)) {
          finalName = `${baseName}-${counter}.${item.targetFormat}`;
          counter++;
        }
        nameTracker.add(finalName);

        zip.file(finalName, item.resultBlob);
        added++;
      }
    });

    if (added > 0) {
      const content = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(content);
      const a = document.createElement('a');
      a.href = url;
      a.download = `converted_images.zip`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const formatOptions = Object.values(FORMAT_REGISTRY)
    .filter(f => f.canEncode)
    .map(f => ({ value: f.format, label: f.name }));

  const bgOptions = [
    { value: '#FFFFFF', label: 'White' },
    { value: '#000000', label: 'Black' }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-4xl mx-auto flex flex-col gap-8"
    >
      {!hasItems ? (
        <DropZone onFilesAdded={(files) => {
          queue.addFiles(files);
          queue.applyGlobalSettings(globalFormat, globalQuality, globalBg);
        }} />
      ) : (
        <div className="flex flex-col gap-6">
          <motion.div 
            layout
            className="flex flex-col sm:flex-row gap-4 p-5 border border-brand-border bg-brand-panel/50 backdrop-blur-md rounded-2xl items-end justify-between shadow-2xl shadow-black/40 relative z-40"
          >
            <div className="flex flex-wrap gap-5 items-end flex-1 w-full">
              <div className="flex flex-col gap-2 w-full sm:w-40 z-20">
                <CustomSelect 
                  label="Global Output Format"
                  value={globalFormat}
                  onChange={handleGlobalFormatChange}
                  options={formatOptions}
                  disabled={isConverting}
                />
              </div>

              {FORMAT_REGISTRY[globalFormat]?.supportsQuality && (
                <motion.div 
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  className="flex flex-col gap-2 flex-1 min-w-[150px] max-w-[200px]"
                >
                  <label className="text-xs font-medium text-brand-secondary flex justify-between mb-1.5">
                    <span className="flex items-center gap-1.5"><Settings2 className="w-3.5 h-3.5" /> Quality</span>
                    <span className="text-brand-primary">{globalQuality}%</span>
                  </label>
                  <div className="h-[38px] flex items-center">
                    <input 
                      type="range" 
                      min="1" max="100" 
                      value={globalQuality}
                      onChange={handleGlobalQualityChange}
                      disabled={isConverting}
                      className="w-full"
                    />
                  </div>
                </motion.div>
              )}

              {!FORMAT_REGISTRY[globalFormat]?.supportsAlpha && (
                <motion.div 
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  className="flex flex-col gap-2 w-full sm:w-32 z-10"
                >
                  <CustomSelect 
                    label="Background"
                    value={globalBg}
                    onChange={handleGlobalBgChange}
                    options={bgOptions}
                    disabled={isConverting}
                  />
                </motion.div>
              )}
            </div>

            <div className="flex gap-3 mt-4 sm:mt-0 w-full sm:w-auto shrink-0 z-0">
              {!allCompleted && (
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={queue.startConversion}
                  disabled={isConverting}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-brand-primary text-brand-bg font-medium rounded-xl hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-white/10"
                >
                  {isConverting ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Converting...</>
                  ) : (
                    <><Play className="w-4 h-4" /> Convert All</>
                  )}
                </motion.button>
              )}
              {allCompleted && (
                <motion.button 
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleDownloadAll}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-green-500 text-black font-medium rounded-xl hover:bg-green-400 transition-colors shadow-lg shadow-green-500/20"
                >
                  <DownloadCloud className="w-4 h-4" /> Download ZIP
                </motion.button>
              )}
            </div>
          </motion.div>
          
          <div className="flex items-center justify-between text-sm text-brand-secondary px-2">
            <span className="font-medium text-brand-primary">{queue.items.length} file{queue.items.length !== 1 ? 's' : ''} queued</span>
            <button 
              onClick={queue.clearAll}
              disabled={isConverting}
              className="flex items-center gap-1.5 hover:text-red-400 transition-colors disabled:opacity-50"
            >
              <Trash2 className="w-4 h-4" /> Clear all
            </button>
          </div>

          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto custom-scrollbar pr-2 pb-48">
            <AnimatePresence mode="popLayout">
              {queue.items.map(item => (
                <FileCard 
                  key={item.id} 
                  item={item} 
                  onRemove={queue.removeItem} 
                  onUpdate={queue.updateItem}
                />
              ))}
            </AnimatePresence>
          </motion.div>
          
          <DropZone 
            onFilesAdded={(files) => {
              queue.addFiles(files);
              queue.applyGlobalSettings(globalFormat, globalQuality, globalBg);
            }}
            className="p-6 h-32"
          />
        </div>
      )}
      
      {/* Accessible Live Region */}
      <div aria-live="polite" className="sr-only">
        {isConverting ? 'Converting images, please wait...' : 
         allCompleted ? 'All conversions completed successfully.' : ''}
      </div>
    </motion.div>
  );
}
