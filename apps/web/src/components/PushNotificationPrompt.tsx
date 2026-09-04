'use client';

import { useEffect, useState } from 'react';
import { isPushSupported, subscribeToPush } from '@/services/push.service';
import { useAppDict } from '@/hooks/useLocale';

const DISMISSED_KEY = 'zawaj-push-dismissed';

export function PushNotificationPrompt() {
  const { dict } = useAppDict();
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isPushSupported()) return;
    if (typeof Notification === 'undefined' || Notification.permission !== 'default') return;
    try {
      if (localStorage.getItem(DISMISSED_KEY)) return;
    } catch {
      // Best-effort: if localStorage is unavailable, just show the prompt every visit.
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setVisible(true);
  }, []);

  function dismiss() {
    setVisible(false);
    try {
      localStorage.setItem(DISMISSED_KEY, '1');
    } catch {
      // Best-effort.
    }
  }

  async function handleEnable() {
    setLoading(true);
    try {
      await subscribeToPush();
    } finally {
      setLoading(false);
      dismiss();
    }
  }

  if (!visible) return null;

  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl bg-blue-50 px-4 py-3">
      <div>
        <p className="text-sm font-semibold text-blue-900">{dict.pushPrompt.title}</p>
        <p className="text-xs text-blue-700/80">{dict.pushPrompt.subtitle}</p>
      </div>
      <div className="flex shrink-0 gap-2">
        <button
          type="button"
          onClick={dismiss}
          className="whitespace-nowrap rounded-xl px-3 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-100"
        >
          {dict.pushPrompt.later}
        </button>
        <button
          type="button"
          disabled={loading}
          onClick={handleEnable}
          className="whitespace-nowrap rounded-xl bg-blue-900 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
        >
          {dict.pushPrompt.enable}
        </button>
      </div>
    </div>
  );
}
