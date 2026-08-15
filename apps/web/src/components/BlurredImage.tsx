'use client';

import { LockClosedIcon } from './icons';

interface BlurredImageProps {
  src: string;
  alt: string;
  isBlurred: boolean;
  lockLabel?: string;
  className?: string;
  onUnlockClick?: () => void;
}

export function BlurredImage({
  src,
  alt,
  isBlurred,
  lockLabel = 'Unlock with coins or VIP',
  className = '',
  onUnlockClick,
}: BlurredImageProps) {
  return (
    <div className={`relative overflow-hidden rounded-2xl bg-blue-50 ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        className={`h-full w-full object-cover transition-all duration-300 ${isBlurred ? 'scale-110 blur-xl' : ''}`}
      />
      {isBlurred && (
        <button
          type="button"
          onClick={onUnlockClick}
          className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-blue-900/40 text-white transition hover:bg-blue-900/50"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gold-500 text-blue-900">
            <LockClosedIcon className="h-5 w-5" />
          </span>
          <span className="px-3 text-center text-sm font-medium">{lockLabel}</span>
        </button>
      )}
    </div>
  );
}
