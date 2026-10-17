'use client';

import { useEffect, useRef, useState } from 'react';
import { uploadToCloudinary } from '@/services/cloudinary.service';
import { useAppDict } from '@/hooks/useLocale';
import { Button } from '@/components/ui/Button';

interface SelfieCameraProps {
  label: string;
  onUploaded: (url: string) => void;
  folder?: string;
}

/**
 * Takes the verification selfie live from the front camera — there is no file
 * picker, so a saved photo of someone else can't be chosen instead.
 */
export function SelfieCamera({ label, onUploaded, folder }: SelfieCameraProps) {
  const { dict } = useAppDict();
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [cameraOn, setCameraOn] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function stopCamera() {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    setCameraOn(false);
  }

  useEffect(() => stopCamera, []);

  async function startCamera() {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 960 } },
        audio: false,
      });
      streamRef.current = stream;
      setCameraOn(true);
      setPreview(null);
      // The <video> is rendered once cameraOn flips, so attach on the next frame.
      requestAnimationFrame(() => {
        if (videoRef.current) videoRef.current.srcObject = stream;
      });
    } catch {
      setError(dict.verification.selfieCameraError);
    }
  }

  async function capture() {
    const video = videoRef.current;
    if (!video || !video.videoWidth) return;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d')?.drawImage(video, 0, 0);
    stopCamera();

    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.9));
    if (!blob) return;
    setPreview(URL.createObjectURL(blob));
    setUploading(true);
    try {
      const url = await uploadToCloudinary(new File([blob], 'selfie.jpg', { type: 'image/jpeg' }), folder);
      onUploaded(url);
    } catch (err) {
      setError(`${dict.imageUploader.errorUploadFailed} [${err instanceof Error ? err.message : String(err)}]`);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-sm font-medium text-ink-700">{label}</span>
      <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-rose-200 bg-rose-50 p-3">
        {cameraOn ? (
          // Mirrored like a mirror, which is what people expect when framing a selfie.
          <video ref={videoRef} autoPlay playsInline muted className="aspect-[3/4] w-48 -scale-x-100 rounded-lg bg-black object-cover" />
        ) : preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt={label} className="aspect-[3/4] w-48 rounded-lg object-cover" />
        ) : (
          <span className="flex h-14 w-14 items-center justify-center rounded-lg bg-surface text-2xl">🤳</span>
        )}
        <p className="text-center text-xs text-ink-500">{dict.verification.selfieHint}</p>
        {cameraOn ? (
          <Button type="button" onClick={capture} className="text-sm">
            {dict.verification.selfieCapture}
          </Button>
        ) : (
          <Button type="button" variant="outline" loading={uploading} onClick={startCamera} className="text-sm">
            {preview ? dict.verification.selfieRetake : dict.verification.selfieStart}
          </Button>
        )}
      </div>
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
}
