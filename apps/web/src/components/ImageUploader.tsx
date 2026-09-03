'use client';

import { useRef, useState } from 'react';
import { uploadToCloudinary } from '@/services/cloudinary.service';
import { useAppDict } from '@/hooks/useLocale';

interface ImageUploaderProps {
  label: string;
  value?: string;
  onUploaded: (url: string) => void;
  folder?: string;
}

export function ImageUploader({ label, value, onUploaded, folder }: ImageUploaderProps) {
  const { dict } = useAppDict();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(value ?? null);

  async function handleFile(file: File) {
    setError(null);
    setPreview(URL.createObjectURL(file));
    setUploading(true);
    try {
      const url = await uploadToCloudinary(file, folder);
      onUploaded(url);
    } catch (err) {
      setError(`${dict.imageUploader.errorUploadFailed} [${err instanceof Error ? err.message : String(err)}]`);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-ink-700">{label}</label>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="flex items-center gap-3 rounded-xl border border-dashed border-rose-200 bg-rose-50 p-3 text-right transition hover:bg-rose-100"
      >
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt={label} className="h-14 w-14 rounded-lg object-cover" />
        ) : (
          <span className="flex h-14 w-14 items-center justify-center rounded-lg bg-surface text-2xl">📷</span>
        )}
        <span className="text-sm text-rose-700">
          {uploading ? dict.imageUploader.uploading : preview ? dict.imageUploader.changePhoto : dict.imageUploader.choosePhoto}
        </span>
      </button>
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
}
