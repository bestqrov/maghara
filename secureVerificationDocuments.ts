import 'dotenv/config';
import mongoose from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { UserSchema } from './src/schemas/user.schema';
import { PrivateDocumentsService } from './src/modules/verification/private-documents.service';

const MONGODB_URI = process.env.MONGODB_URI;

/**
 * One-off: moves verification documents submitted before they were made
 * private (still stored as public Cloudinary URLs) to private storage, so
 * their public links stop working. Safe to re-run.
 */
async function secureVerificationDocuments() {
  if (!MONGODB_URI) {
    throw new Error('MONGODB_URI is not set (check your .env file)');
  }

  const privateDocuments = new PrivateDocumentsService(new ConfigService());
  if (!privateDocuments.enabled) {
    throw new Error('CLOUDINARY_API_KEY / CLOUDINARY_API_SECRET are not set (check your .env file)');
  }

  await mongoose.connect(MONGODB_URI);
  console.log('✅ Connected to MongoDB...');

  const User = mongoose.model('User', UserSchema);
  const users = await User.find({
    $or: [
      { 'verificationDocuments.idDocumentUrl': { $exists: true, $ne: null } },
      { 'verificationDocuments.residencyDocumentUrl': { $exists: true, $ne: null } },
    ],
  }).select('verificationDocuments');

  let secured = 0;
  let failed = 0;
  for (const user of users) {
    const docs = user.verificationDocuments!;
    for (const [urlField, refField] of [
      ['idDocumentUrl', 'idDocument'],
      ['residencyDocumentUrl', 'residencyDocument'],
    ] as const) {
      const url = docs[urlField];
      if (!url) continue;
      try {
        docs[refField] = await privateDocuments.makePrivate(url);
        docs[urlField] = undefined;
        secured++;
      } catch (error) {
        failed++;
        console.error(`⚠️ User ${String(user._id)} ${urlField}: ${(error as Error).message ?? JSON.stringify(error)}`);
      }
    }
    user.markModified('verificationDocuments');
    await user.save();
  }

  console.log(`🚀 Secured ${secured} document(s) across ${users.length} user(s); ${failed} failed.`);

  await mongoose.disconnect();
}

secureVerificationDocuments()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error securing verification documents:', error);
    process.exit(1);
  });
