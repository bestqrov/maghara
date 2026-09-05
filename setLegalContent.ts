import 'dotenv/config';
import mongoose from 'mongoose';
import * as fs from 'fs';
import * as path from 'path';
import { AppConfigSchema } from './src/schemas/app-config.schema';

const MONGODB_URI = process.env.MONGODB_URI;

async function setLegalContent() {
  if (!MONGODB_URI) {
    throw new Error('MONGODB_URI is not set (check your .env file)');
  }

  await mongoose.connect(MONGODB_URI);
  console.log('✅ Connected to MongoDB...');

  const AppConfig = mongoose.model('AppConfig', AppConfigSchema);

  const content = JSON.parse(fs.readFileSync(path.join(__dirname, 'legalContent.json'), 'utf-8'));

  await AppConfig.findOneAndUpdate(
    {},
    {
      $setOnInsert: { general: {}, appSettings: {}, appUpdate: {}, builds: {} },
      $set: {
        'privacyPolicy.content': content.privacyPolicy,
        'termsConditions.content': content.termsConditions,
      },
    },
    { upsert: true, new: true },
  );

  console.log('🚀 Privacy policy and terms & conditions content saved.');

  await mongoose.disconnect();
}

setLegalContent()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error setting legal content:', error);
    process.exit(1);
  });
