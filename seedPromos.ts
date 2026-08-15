import 'dotenv/config';
import mongoose from 'mongoose';
import { PromoCodeSchema } from './src/schemas/promo-code.schema';

const MONGODB_URI = process.env.MONGODB_URI;

const LAUNCH_CODE = {
  code: 'QISMA2026',
  type: 'VIP_DAYS' as const,
  rewardValue: 30,
  maxRedemptions: 1000,
  requiresVerification: true,
  isActive: true,
};

async function seedPromos() {
  if (!MONGODB_URI) {
    throw new Error('MONGODB_URI is not set (check your .env file)');
  }

  await mongoose.connect(MONGODB_URI);
  console.log('✅ Connected to MongoDB...');

  const PromoCode = mongoose.model('PromoCode', PromoCodeSchema);

  await PromoCode.updateOne(
    { code: LAUNCH_CODE.code },
    { $setOnInsert: LAUNCH_CODE },
    { upsert: true },
  );

  console.log(`🚀 Launch promo code "${LAUNCH_CODE.code}" is ready (30 days VIP, max ${LAUNCH_CODE.maxRedemptions} redemptions).`);

  await mongoose.disconnect();
}

seedPromos()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error seeding promo codes:', error);
    process.exit(1);
  });
