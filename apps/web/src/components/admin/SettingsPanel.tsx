'use client';

import { useState } from 'react';
import { isAxiosError } from 'axios';
import { changeAdminPassword } from '@/services/admin.service';
import { useAdminDict } from '@/hooks/useAdminLocale';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { CheckCircleIcon } from '@/components/icons';

export function SettingsPanel() {
  const { dict } = useAdminDict();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (newPassword.length < 8) {
      setError(dict.settings.errorMinLength);
      return;
    }
    if (newPassword !== confirmPassword) {
      setError(dict.settings.errorMismatch);
      return;
    }

    setLoading(true);
    try {
      await changeAdminPassword(currentPassword, newPassword);
      setSuccess(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      if (isAxiosError(err) && err.response?.status === 401) {
        setError(dict.settings.errorWrongPassword);
      } else {
        setError(dict.settings.errorGeneric);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-sm rounded-2xl border border-blue-100 bg-surface p-6 shadow-sm">
      <h3 className="font-semibold text-blue-900">{dict.settings.title}</h3>
      <form onSubmit={onSubmit} className="mt-4 flex flex-col gap-4">
        <Input
          id="adminCurrentPassword"
          label={dict.settings.currentPasswordLabel}
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          required
        />
        <Input
          id="adminNewPassword"
          label={dict.settings.newPasswordLabel}
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <Input
          id="adminConfirmPassword"
          label={dict.settings.confirmPasswordLabel}
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        {error && <p className="text-sm text-red-500">{error}</p>}
        <Button type="submit" loading={loading} className="text-sm">
          {dict.settings.save}
        </Button>
      </form>

      {success && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-blue-900/50 p-4">
          <div className="w-full max-w-sm rounded-3xl bg-surface p-6 text-center shadow-xl">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
              <CheckCircleIcon className="h-7 w-7" />
            </div>
            <h2 className="mt-4 text-lg font-bold text-emerald-700">{dict.settings.successTitle}</h2>
            <p className="mt-2 text-sm text-ink-500">{dict.settings.successSubtitle}</p>
            <Button onClick={() => setSuccess(false)} className="mt-6 w-full">
              {dict.settings.successOk}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
