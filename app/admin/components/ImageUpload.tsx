'use client';

import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import Image from 'next/image';
import { Upload, X } from 'lucide-react';
import { validateFile } from '../utils/fileValidation';

// Re-export for consumers who want the pure helper from this module
export { validateFile } from '../utils/fileValidation';

interface ImageUploadProps {
  value: string[];
  onChange: (urls: string[]) => void;
  maxFiles?: number;
}

export interface ImageUploadHandle {
  getPendingFiles: () => File[];
}

interface PendingEntry {
  file: File;
  preview: string;
}

const ImageUpload = forwardRef<ImageUploadHandle, ImageUploadProps>(
  function ImageUpload({ value, onChange, maxFiles = 10 }, ref) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [pending, setPending] = useState<PendingEntry[]>([]);

  useImperativeHandle(ref, () => ({
    getPendingFiles: () => pending.map((e) => e.file),
  }));
  const [errors, setErrors] = useState<string[]>([]);
  const [dragging, setDragging] = useState(false);

  const totalCount = value.length + pending.length;

  function processFiles(files: FileList | File[]) {
    const newErrors: string[] = [];
    const newEntries: PendingEntry[] = [];

    Array.from(files).forEach((file) => {
      if (totalCount + newEntries.length >= maxFiles) {
        newErrors.push(`Maximum ${maxFiles} images allowed`);
        return;
      }
      const err = validateFile(file);
      if (err) {
        newErrors.push(`${file.name}: ${err}`);
      } else {
        newEntries.push({ file, preview: URL.createObjectURL(file) });
      }
    });

    setErrors(newErrors);

    if (newEntries.length > 0) {
      const updatedPending = [...pending, ...newEntries];
      setPending(updatedPending);
      // Only pass existing confirmed URLs to parent — pending files are tracked internally
      // Parent gets notified via onChange but we don't mix blob URLs into value
      onChange(value); // keep existing URLs unchanged; pending tracked via ref
    }
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) processFiles(e.target.files);
    // Reset input so the same file can be re-selected
    e.target.value = '';
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files) processFiles(e.dataTransfer.files);
  }

  function removePending(index: number) {
    const entry = pending[index];
    URL.revokeObjectURL(entry.preview);
    const updated = pending.filter((_, i) => i !== index);
    setPending(updated);
    // Don't touch value — only pending changed
    onChange(value);
  }

  function removeExisting(index: number) {
    const updated = value.filter((_, i) => i !== index);
    onChange(updated);
  }

  return (
    <div className="space-y-3">
      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
          dragging
            ? 'border-neutral-900 bg-neutral-50'
            : 'border-neutral-300 hover:border-neutral-400 hover:bg-neutral-50'
        }`}
      >
        <Upload size={24} className="mx-auto mb-2 text-neutral-400" />
        <p className="text-sm text-neutral-600">
          Drag &amp; drop images here, or <span className="font-medium underline">click to select</span>
        </p>
        <p className="text-xs text-neutral-400 mt-1">JPG, PNG, WebP · max 10MB each · up to {maxFiles} files</p>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          className="hidden"
          onChange={handleInputChange}
        />
      </div>

      {/* Inline errors */}
      {errors.length > 0 && (
        <ul className="space-y-1">
          {errors.map((err, i) => (
            <li key={i} className="text-xs text-red-600">{err}</li>
          ))}
        </ul>
      )}

      {/* Previews: existing URLs */}
      {(value.length > 0 || pending.length > 0) && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
          {value.map((url, i) => (
            <div key={`existing-${i}`} className="relative aspect-square rounded-lg overflow-hidden border border-neutral-200">
              <Image src={url} alt={`Image ${i + 1}`} fill className="object-cover" />
              <button
                type="button"
                onClick={() => removeExisting(i)}
                className="absolute top-1 right-1 bg-black/60 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-black/80"
                aria-label="Remove image"
              >
                <X size={12} />
              </button>
            </div>
          ))}

          {/* Pending previews (blob URLs) */}
          {pending.map((entry, i) => (
            <div key={`pending-${i}`} className="relative aspect-square rounded-lg overflow-hidden border border-neutral-200">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={entry.preview} alt={`Pending ${i + 1}`} className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => removePending(i)}
                className="absolute top-1 right-1 bg-black/60 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-black/80"
                aria-label="Remove image"
              >
                <X size={12} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
});

export default ImageUpload;