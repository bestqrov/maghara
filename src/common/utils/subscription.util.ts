import { HydratedDocument } from 'mongoose';
import { User } from '../../schemas/user.schema';

/**
 * Payment-purchased VIP has no expiry and stays permanent. Promo/referral VIP
 * time is tracked via `vipExpiresAt` — once it's in the past, this lazily
 * downgrades the user back to FREE (persisted) and returns the up-to-date
 * VIP status. Users with no `vipExpiresAt` (e.g. paid VIP) are never touched.
 */
export async function resolveIsVip(user: HydratedDocument<User>): Promise<boolean> {
  const isElevatedTier = user.subscriptionTier === 'VIP' || user.subscriptionTier === 'CROSS_BORDER_VIP';
  if (!isElevatedTier) return false;

  // vipExpiresAt only ever tracks a temporary 'VIP' grant (promo/referral) —
  // CROSS_BORDER_VIP (from a promo or payment) is treated as permanent, so a
  // stale leftover vipExpiresAt from an earlier VIP_DAYS redemption must not
  // downgrade it.
  if (user.subscriptionTier === 'VIP' && user.vipExpiresAt && user.vipExpiresAt < new Date()) {
    user.subscriptionTier = 'FREE';
    user.vipExpiresAt = undefined;
    await user.save();
    return false;
  }

  return true;
}
