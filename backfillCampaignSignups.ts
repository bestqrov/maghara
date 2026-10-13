import 'dotenv/config';
import mongoose from 'mongoose';
import { UserSchema } from './src/schemas/user.schema';
import { SignupCampaignSchema } from './src/schemas/signup-campaign.schema';

const MONGODB_URI = process.env.MONGODB_URI;

/**
 * One-off: flags members who registered during the current signup campaign
 * window before joinedViaSignupCampaign existed, so they also get the
 * "add your photos" reminder on their profile.
 */
async function backfillCampaignSignups() {
  if (!MONGODB_URI) {
    throw new Error('MONGODB_URI is not set (check your .env file)');
  }

  await mongoose.connect(MONGODB_URI);
  console.log('✅ Connected to MongoDB...');

  const User = mongoose.model('User', UserSchema);
  const SignupCampaign = mongoose.model('SignupCampaign', SignupCampaignSchema);

  const campaign = await SignupCampaign.findOne();
  if (!campaign?.startsAt) {
    console.log('ℹ️ No signup campaign with a start date — nothing to backfill.');
    await mongoose.disconnect();
    return;
  }

  const createdAt: Record<string, Date> = { $gte: campaign.startsAt };
  if (campaign.endsAt) createdAt.$lt = campaign.endsAt;

  const result = await User.updateMany(
    { createdAt, isSeed: { $ne: true }, joinedViaSignupCampaign: { $ne: true } },
    { $set: { joinedViaSignupCampaign: true } },
  );

  console.log(`🚀 Flagged ${result.modifiedCount} campaign signup(s).`);

  await mongoose.disconnect();
}

backfillCampaignSignups()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error backfilling campaign signups:', error);
    process.exit(1);
  });
