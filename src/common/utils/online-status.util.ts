export const ONLINE_THRESHOLD_MS = 5 * 60 * 1000;

export function isUserOnline(lastActiveAt?: Date): boolean {
  if (!lastActiveAt) return false;
  return Date.now() - lastActiveAt.getTime() < ONLINE_THRESHOLD_MS;
}
