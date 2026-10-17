import { Injectable, Logger } from '@nestjs/common';
import * as path from 'path';
import sharp from 'sharp';
import * as tf from '@tensorflow/tfjs';
import { setWasmPaths } from '@tensorflow/tfjs-backend-wasm';
import * as faceapi from '@vladmandic/face-api/dist/face-api.node-wasm.js';

/**
 * Below this distance two faces are treated as the same person — the usual
 * cut-off for this recognition model (0 = identical, ~1 = unrelated).
 */
export const SAME_PERSON_MAX_DISTANCE = 0.6;
/** A match this close is shown to admins as a strong match. */
export const STRONG_MATCH_MAX_DISTANCE = 0.45;

/** Largest side, in pixels, an image is scaled down to before detection. */
const MAX_IMAGE_SIDE = 1024;

export interface FaceComparison {
  /** Faces found on the ID card / passport photo, and on the selfie. */
  documentFaces: number;
  selfieFaces: number;
  /** Selfie vs the document's face; null when either has no face. */
  distance: number | null;
  /** Selfie vs the closest of the member's profile photos; null when none could be compared. */
  profileDistance: number | null;
}

/**
 * Compares faces entirely on our own server with an open-source model
 * (face-api, running on TensorFlow's WebAssembly backend — no native build, no
 * outside service, no per-check cost). The model files ship inside the npm
 * package, so nothing is downloaded at runtime.
 */
@Injectable()
export class FaceMatchService {
  private readonly logger = new Logger(FaceMatchService.name);
  private ready?: Promise<void>;

  private init() {
    this.ready ??= (async () => {
      setWasmPaths(path.join(path.dirname(require.resolve('@tensorflow/tfjs-backend-wasm/package.json')), 'dist/'));
      await tf.setBackend('wasm');
      await tf.ready();
      const models = path.join(path.dirname(require.resolve('@vladmandic/face-api/package.json')), 'model');
      await faceapi.nets.ssdMobilenetv1.loadFromDisk(models);
      await faceapi.nets.faceLandmark68Net.loadFromDisk(models);
      await faceapi.nets.faceRecognitionNet.loadFromDisk(models);
      this.logger.log('Face recognition models loaded');
    })();
    return this.ready;
  }

  /** Every face found in an image, as a 128-number descriptor. */
  private async descriptors(image: Buffer): Promise<Float32Array[]> {
    const { data, info } = await sharp(image)
      .rotate() // honour the phone's EXIF orientation
      .resize(MAX_IMAGE_SIDE, MAX_IMAGE_SIDE, { fit: 'inside', withoutEnlargement: true })
      .removeAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });
    const tensor = tf.tensor3d(new Uint8Array(data), [info.height, info.width, 3]);
    try {
      const faces = await faceapi
        .detectAllFaces(tensor as never, new faceapi.SsdMobilenetv1Options({ minConfidence: 0.5 }))
        .withFaceLandmarks()
        .withFaceDescriptors();
      return faces.map((f) => f.descriptor);
    } finally {
      tensor.dispose();
    }
  }

  private static closest(a: Float32Array[], b: Float32Array[]): number | null {
    let best: number | null = null;
    for (const x of a) {
      for (const y of b) {
        const d = faceapi.euclideanDistance(x, y);
        if (best === null || d < best) best = d;
      }
    }
    return best === null ? null : Math.round(best * 1000) / 1000;
  }

  async compare(document: Buffer, selfie: Buffer, profilePhotos: Buffer[]): Promise<FaceComparison> {
    await this.init();
    const documentFaces = await this.descriptors(document);
    const selfieFaces = await this.descriptors(selfie);

    const profileFaces: Float32Array[] = [];
    for (const photo of profilePhotos) {
      try {
        profileFaces.push(...(await this.descriptors(photo)));
      } catch {
        // an unreadable profile photo just isn't compared
      }
    }

    return {
      documentFaces: documentFaces.length,
      selfieFaces: selfieFaces.length,
      distance: FaceMatchService.closest(selfieFaces, documentFaces),
      profileDistance: FaceMatchService.closest(selfieFaces, profileFaces),
    };
  }
}
