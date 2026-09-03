'use client';

import { useState } from 'react';
import { isAxiosError } from 'axios';
import { changeAdminPassword } from '@/services/admin.service';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export function SettingsPanel() {
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
      setError('يجب أن تتكون كلمة المرور الجديدة من 8 أحرف على الأقل');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('كلمة المرور الجديدة غير مطابقة للتأكيد');
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
        setError('كلمة المرور الحالية غير صحيحة');
      } else {
        setError('تعذّر تغيير كلمة المرور، حاول مرة أخرى');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-sm rounded-2xl border border-blue-100 bg-surface p-6 shadow-sm">
      <h3 className="font-semibold text-blue-900">تغيير كلمة مرور المشرف</h3>
      <form onSubmit={onSubmit} className="mt-4 flex flex-col gap-4">
        <Input
          id="adminCurrentPassword"
          label="كلمة المرور الحالية"
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          required
        />
        <Input
          id="adminNewPassword"
          label="كلمة المرور الجديدة"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <Input
          id="adminConfirmPassword"
          label="تأكيد كلمة المرور الجديدة"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        {error && <p className="text-sm text-red-500">{error}</p>}
        {success && <p className="text-sm text-emerald-600">تم تغيير كلمة المرور بنجاح</p>}
        <Button type="submit" loading={loading} className="text-sm">
          حفظ كلمة المرور
        </Button>
      </form>
    </div>
  );
}
