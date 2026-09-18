import { useState, useCallback, useRef, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ImageFormat, getFormatByExtension, getFormatByMimeType } from './codecs/FormatRegistry';
import { WorkerPool } from './workers/WorkerPool';

export type FileStatus = 'waiting' | 'processing' | 'completed' | 'failed';

export interface QueueItem {
  id: string;
  file: File;
  originalFormat: ImageFormat | 'unknown';
  targetFormat: ImageFormat;
  status: FileStatus;
  progress: number;
  resultBlob?: Blob;
  error?: string;
  quality: number; // 0-100
  backgroundColor: string; // for transparency conversion
}

export const useConversionQueue = () => {
  const [items, setItems] = useState<QueueItem[]>([]);
  const workerPool = useRef<WorkerPool | null>(null);

  useEffect(() => {
    workerPool.current = new WorkerPool();
    return () => {
      workerPool.current?.destroy();
    };
  }, []);

  const addFiles = useCallback((files: File[]) => {
    const newItems: QueueItem[] = files.map(file => {
      const format = getFormatByMimeType(file.type) || getFormatByExtension(file.name) || 'unknown';
      // Default to webp if we can encode it, otherwise png
      return {
        id: uuidv4(),
        file,
        originalFormat: format,
        targetFormat: 'webp',
        status: 'waiting',
        progress: 0,
        quality: 80,
        backgroundColor: '#FFFFFF'
      };
    });
    setItems(prev => [...prev, ...newItems]);
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setItems([]);
  }, []);

  const updateItem = useCallback((id: string, updates: Partial<QueueItem>) => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, ...updates } : item));
  }, []);

  const applyGlobalSettings = useCallback((targetFormat: ImageFormat, quality: number, backgroundColor: string) => {
    setItems(prev => prev.map(item => {
      if (item.status === 'waiting') {
        return { ...item, targetFormat, quality, backgroundColor };
      }
      return item;
    }));
  }, []);

  const processQueue = useCallback(async () => {
    if (!workerPool.current) return;

    // Find all waiting items
    const waitingIds = items.filter(i => i.status === 'waiting').map(i => i.id);
    
    // Set them to processing
    setItems(prev => prev.map(item => 
      waitingIds.includes(item.id) ? { ...item, status: 'processing' } : item
    ));

    // We only process one by one in terms of kicking them off, but the worker pool handles concurrency
    for (const id of waitingIds) {
      const item = items.find(i => i.id === id);
      // Because state might be stale in this loop if not careful, we rely on the id.
      // But let's actually just get the latest from state or the original array since we just mapped it.
      // Actually we must fetch the latest item values, but let's use the local `items` reference we captured.
      // A better way is to rely on functional state updates, but since we are firing promises, it's easier to just fire them all to the pool.
    }
  }, [items]);

  // A safer processQueue:
  const startConversion = useCallback(async () => {
    setItems(prev => {
      const itemsToProcess = prev.filter(i => i.status === 'waiting');
      if (itemsToProcess.length === 0) return prev;

      itemsToProcess.forEach(item => {
        // Kick off worker task
        workerPool.current?.enqueueTask({
          id: item.id,
          file: item.file,
          targetFormat: item.targetFormat,
          quality: item.quality,
          backgroundColor: item.backgroundColor,
        }).then(response => {
          updateItem(item.id, {
            status: response.success ? 'completed' : 'failed',
            resultBlob: response.blob,
            error: response.error,
            progress: 100
          });
        });
      });

      return prev.map(item => itemsToProcess.some(i => i.id === item.id) ? { ...item, status: 'processing' } : item);
    });
  }, [updateItem]);

  return {
    items,
    addFiles,
    removeItem,
    clearAll,
    updateItem,
    applyGlobalSettings,
    startConversion
  };
};
