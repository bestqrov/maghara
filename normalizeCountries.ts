import 'dotenv/config';
import mongoose from 'mongoose';
import { UserSchema } from './src/schemas/user.schema';
import { canonicalCountry } from './src/common/utils/country.util';

const MONGODB_URI = process.env.MONGODB_URI;
// Dry run by default: pass --apply to actually write the changes.
const APPLY = process.argv.includes('--apply');

async function normalizeCountries() {
  if (!MONGODB_URI) {
    throw new Error('MONGODB_URI is not set (check your .env file)');
  }

  await mongoose.connect(MONGODB_URI);
  console.log(`✅ Connected to MongoDB... (${APPLY ? 'APPLY' : 'dry run'})`);

  const User = mongoose.model('User', UserSchema);
  const users = await User.find({}, 'profile.residenceCountry profile.originCountry profile.matchCriteria').lean();

  const unknown = new Map<string, number>();
  const ops: any[] = [];

  const fix = (value: string | undefined) => {
    if (!value) return value;
    const canonical = canonicalCountry(value);
    if (!canonical) unknown.set(value, (unknown.get(value) ?? 0) + 1);
    return canonical ?? value;
  };

  for (const user of users) {
    const profile: any = user.profile ?? {};
    const $set: Record<string, unknown> = {};

    const residence = fix(profile.residenceCountry);
    if (residence !== profile.residenceCountry) $set['profile.residenceCountry'] = residence;

    const origin = fix(profile.originCountry);
    if (origin !== profile.originCountry) $set['profile.originCountry'] = origin;

    const targets: string[] | undefined = profile.matchCriteria?.targetCountries;
    if (targets?.length) {
      const fixed = targets.map((t) => fix(t) as string);
      if (fixed.some((t, i) => t !== targets[i])) $set['profile.matchCriteria.targetCountries'] = fixed;
    }

    if (Object.keys($set).length) {
      console.log(`• ${user._id}:`, $set);
      ops.push({ updateOne: { filter: { _id: user._id }, update: { $set } } });
    }
  }

  console.log(`\n${ops.length} of ${users.length} user(s) need a fix.`);
  if (unknown.size) {
    console.log('⚠️  Unrecognized countries (left as-is — add them to src/common/data/countries.data.ts):');
    for (const [value, count] of unknown) console.log(`   "${value}" × ${count}`);
  }

  if (APPLY && ops.length) {
    const result = await User.bulkWrite(ops);
    console.log(`🚀 Updated ${result.modifiedCount} user(s).`);
  } else if (ops.length) {
    console.log('Dry run only — re-run with --apply to write these changes.');
  }

  await mongoose.disconnect();
}

normalizeCountries()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error normalizing countries:', error);
    process.exit(1);
  });
