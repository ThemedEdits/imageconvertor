'use client';
import { QueueItem } from '@/lib/useConversionQueue';
import { X, CheckCircle2, AlertCircle, Loader2, Download, ImageIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FORMAT_REGISTRY, ImageFormat } from '@/lib/codecs/FormatRegistry';
import { CustomSelect } from '../ui/CustomSelect';

interface FileCardProps {
  item: QueueItem;
  onRemove: (id: string) => void;
  onUpdate: (id: string, updates: Partial<QueueItem>) => void;
}

export function FileCard({ item, onRemove, onUpdate }: FileCardProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (item.file && !preview) {
      const url = URL.createObjectURL(item.file);
      setPreview(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [item.file, preview]);

  const handleDownload = () => {
    if (item.resultBlob) {
      const url = URL.createObjectURL(item.resultBlob);
      const a = document.createElement('a');
      a.href = url;
      const nameParts = item.file.name.split('.');
      nameParts.pop();
      a.download = `${nameParts.join('.')}.${item.targetFormat}`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const statusIcon = {
    waiting: null,
    processing: <Loader2 className="w-5 h-5 text-brand-secondary animate-spin" />,
    completed: <CheckCircle2 className="w-5 h-5 text-green-500" />,
    failed: <AlertCircle className="w-5 h-5 text-red-500" />
  }[item.status];

  const formatOptions = Object.values(FORMAT_REGISTRY)
    .filter(f => f.canEncode)
    .map(f => ({ value: f.format, label: f.name }));

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      style={{ zIndex: isHovered ? 50 : 1 }}
      className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 border border-brand-border bg-brand-panel rounded-xl group hover:border-brand-secondary/50 transition-all relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="w-16 h-16 shrink-0 bg-brand-bg rounded-lg overflow-hidden border border-brand-border flex items-center justify-center relative">
        {preview ? (
          <motion.img 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            src={preview} 
            alt="" 
            className="w-full h-full object-cover" 
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-brand-accent/30 animate-pulse">
            <ImageIcon className="w-6 h-6 text-brand-secondary/50" />
          </div>
        )}
        
        {/* Progress overlay for processing state */}
        <AnimatePresence>
          {item.status === 'processing' && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-lg"
            >
              <Loader2 className="w-6 h-6 text-white animate-spin" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      <div className="flex-1 min-w-0 flex flex-col gap-1 z-10">
        <div className="flex justify-between items-start">
          <h4 className="text-brand-primary text-sm font-medium truncate pr-4" title={item.file.name}>
            {item.file.name}
          </h4>
          <button 
            onClick={() => onRemove(item.id)}
            disabled={item.status === 'processing'}
            className="text-brand-secondary hover:text-red-400 transition-colors disabled:opacity-0 focus:outline-none"
            title="Remove"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-brand-secondary mt-1">
          <span className="uppercase bg-brand-bg px-2 py-0.5 rounded-md border border-brand-border whitespace-nowrap">
            {item.originalFormat}
          </span>
          <span className="text-brand-secondary/50 shrink-0">&rarr;</span>
          
          {item.status === 'waiting' ? (
            <div className="w-24 shrink-0">
              <CustomSelect 
                value={item.targetFormat}
                onChange={(val) => onUpdate(item.id, { targetFormat: val as ImageFormat })}
                options={formatOptions}
                className="w-24 [&_button]:py-0.5 [&_button]:px-2 [&_button]:text-xs [&_button]:h-6"
              />
            </div>
          ) : (
            <span className="uppercase text-brand-primary bg-brand-bg px-2 py-0.5 rounded-md border border-brand-border whitespace-nowrap">
              {item.targetFormat}
            </span>
          )}
          
          <span className="ml-auto shrink-0">{(item.file.size / 1024 / 1024).toFixed(2)} MB</span>
        </div>

        <AnimatePresence>
          {item.status === 'failed' && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="text-xs text-red-400 mt-2 truncate bg-red-950/30 px-2 py-1 rounded-md border border-red-900/50"
              title={item.error}
            >
              {item.error || 'Conversion failed'}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="shrink-0 flex items-center justify-end w-10">
        <AnimatePresence mode="wait">
          {item.status === 'completed' ? (
            <motion.button 
              key="download"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleDownload}
              className="p-2 bg-brand-primary text-brand-bg hover:bg-white rounded-full transition-colors shadow-lg shadow-black/20"
              title="Download"
            >
              <Download className="w-4 h-4" />
            </motion.button>
          ) : (
            <motion.div 
              key="status"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {statusIcon}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
