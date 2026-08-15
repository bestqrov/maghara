import 'dotenv/config';
import mongoose from 'mongoose';
import { UserSchema } from './src/schemas/user.schema';
import { generateUniqueReferralCode } from './src/common/utils/referral-code.util';

const MONGODB_URI = process.env.MONGODB_URI;

async function backfill() {
  if (!MONGODB_URI) {
    throw new Error('MONGODB_URI is not set (check your .env file)');
  }

  await mongoose.connect(MONGODB_URI);
  console.log('✅ Connected to MongoDB...');

  const User = mongoose.model('User', UserSchema);

  const usersMissingCode = await User.find({
    $or: [{ referralCode: { $exists: false } }, { referralCode: null }],
  });

  console.log(`Found ${usersMissingCode.length} user(s) without a referralCode.`);

  for (const user of usersMissingCode) {
    user.referralCode = await generateUniqueReferralCode(User as any);
    await user.save();
  }

  console.log(`🚀 Backfilled referral codes for ${usersMissingCode.length} user(s).`);

  await mongoose.disconnect();
}

backfill()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error backfilling referral codes:', error);
    process.exit(1);
  });
