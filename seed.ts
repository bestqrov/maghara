import 'dotenv/config';
import mongoose from 'mongoose';
import * as fs from 'fs';
import * as path from 'path';
import { UserSchema } from './src/schemas/user.schema';

const MONGODB_URI = process.env.MONGODB_URI;

async function seedDatabase() {
  if (!MONGODB_URI) {
    throw new Error('MONGODB_URI is not set (check your .env file)');
  }

  await mongoose.connect(MONGODB_URI);
  console.log('✅ Connected to MongoDB...');

  const User = mongoose.model('User', UserSchema);

  const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'seedProfiles.json'), 'utf-8'));
  const phoneNumbers = data.map((entry: { phoneNumber: string }) => entry.phoneNumber);

  await User.deleteMany({ phoneNumber: { $in: phoneNumbers } });
  console.log('🧹 Cleaned existing test profiles.');

  await User.insertMany(data);
  console.log(`🚀 Successfully seeded ${data.length} test profiles!`);

  await mongoose.disconnect();
}

seedDatabase()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  });
