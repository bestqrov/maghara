import { Model } from 'mongoose';
import { User } from '../../schemas/user.schema';

const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // no 0/O/1/I to avoid ambiguity
const LENGTH = 7;
const MAX_ATTEMPTS = 10;

function randomCode(): string {
  let code = '';
  for (let i = 0; i < LENGTH; i++) {
    code += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
  }
  return code;
}

/** Generates a unique, unused referral code by retrying on the rare collision. */
export async function generateUniqueReferralCode(userModel: Model<User>): Promise<string> {
  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    const code = randomCode();
    const exists = await userModel.exists({ referralCode: code });
    if (!exists) return code;
  }
  throw new Error('Could not generate a unique referral code after multiple attempts');
}
