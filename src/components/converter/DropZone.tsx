'use client';
import { useCallback } from 'react';
import { UploadCloud } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface DropZoneProps {
  onFilesAdded: (files: File[]) => void;
  className?: string;
}

export function DropZone({ onFilesAdded, className }: DropZoneProps) {
  const onDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFilesAdded(Array.from(e.dataTransfer.files));
    }
  }, [onFilesAdded]);

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const onClick = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = true;
    input.accept = 'image/*';
    input.onchange = (e) => {
      const target = e.target as HTMLInputElement;
      if (target.files && target.files.length > 0) {
        onFilesAdded(Array.from(target.files));
      }
    };
    input.click();
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label="File upload dropzone"
      onDrop={onDrop}
      onDragOver={onDragOver}
      onClick={onClick}
      onKeyDown={onKeyDown}
      className={twMerge(
        "w-full p-12 border-2 border-dashed border-brand-border rounded-xl flex flex-col items-center justify-center bg-brand-panel text-brand-secondary hover:border-brand-secondary transition-colors cursor-pointer group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary",
        className
      )}
    >
      <div className="w-16 h-16 rounded-full bg-brand-bg flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
        <UploadCloud className="w-8 h-8 text-brand-primary" />
      </div>
      <p className="text-brand-primary font-medium text-lg">Click or drag images here</p>
      <p className="text-sm mt-2 max-w-sm text-center text-brand-secondary/80">
        Supports JPG, PNG, WebP, AVIF, SVG, BMP, ICO. Conversions run locally on your device.
      </p>
    </div>
  );
}
