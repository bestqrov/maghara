/**
 * Resets the super-admin password stored in the `adminsettings` collection.
 *
 * Usage: npx ts-node resetAdminPassword.ts "<new-password>"
 */
import 'dotenv/config';
import mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';

const BCRYPT_ROUNDS = 12;

async function main() {
  const newPassword = process.argv[2];
  if (!newPassword || newPassword.length < 8) {
    console.error('Usage: npx ts-node resetAdminPassword.ts "<new-password>" (min 8 chars)');
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGODB_URI!);
  const collection = mongoose.connection.collection('adminsettings');

  const passwordHash = await bcrypt.hash(newPassword, BCRYPT_ROUNDS);
  const existing = await collection.findOne();
  if (existing) {
    await collection.updateOne({ _id: existing._id }, { $set: { passwordHash, updatedAt: new Date() } });
  } else {
    await collection.insertOne({ passwordHash, createdAt: new Date(), updatedAt: new Date() });
  }

  console.log('Super-admin password reset.');
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
