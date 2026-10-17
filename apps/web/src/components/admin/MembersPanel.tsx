'use client';

import { useEffect, useState } from 'react';
import { isAxiosError } from 'axios';
import {
  MemberListItem,
  MemberPayload,
  createMember,
  deleteMember,
  downloadMembersCsv,
  listMembers,
  updateMember,
} from '@/services/admin.service';
import { useAdminDict } from '@/hooks/useAdminLocale';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';

const LIMIT = 25;

const TIERS = ['FREE', 'VIP', 'CROSS_BORDER_VIP'];
const VERIFICATION_STATUSES = ['UNVERIFIED', 'PENDING', 'VERIFIED', 'REJECTED'];

const emptyForm: MemberPayload = {
  phoneNumber: '',
  email: '',
  password: '',
  firstName: '',
  gender: 'MALE',
  birthDate: '',
  residenceCountry: '',
  currentCity: '',
  originCountry: '',
  subscriptionTier: 'FREE',
  verificationStatus: 'UNVERIFIED',
  coinBalance: 0,
};

function toForm(item: MemberListItem): MemberPayload {
  return {
    phoneNumber: item.phoneNumber,
    email: item.email ?? '',
    password: '',
    firstName: item.profile.firstName,
    gender: item.profile.gender,
    birthDate: item.profile.birthDate.slice(0, 10),
    residenceCountry: item.profile.residenceCountry,
    currentCity: item.profile.currentCity,
    originCountry: item.profile.originCountry,
    subscriptionTier: item.subscriptionTier,
    verificationStatus: item.verificationStatus,
    coinBalance: item.coinBalance,
  };
}

function apiErrorMessage(err: unknown, fallback: string) {
  if (isAxiosError(err) && err.response?.data && typeof err.response.data === 'object' && 'message' in err.response.data) {
    const message = (err.response.data as { message: unknown }).message;
    return Array.isArray(message) ? message.join(', ') : String(message);
  }
  return fallback;
}

function calculateAge(birthDate: string) {
  const diff = Date.now() - new Date(birthDate).getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
}

export function MembersPanel() {
  const { dict } = useAdminDict();
  const [items, setItems] = useState<MemberListItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);
  // null = form closed, 'new' = creating, otherwise the id of the member being edited
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<MemberPayload>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function refresh(currentPage: number, currentSearch: string) {
    setLoading(true);
    setError(null);
    try {
      const data = await listMembers(currentSearch, currentPage, LIMIT);
      setItems(data.items);
      setTotal(data.total);
    } catch {
      setError(dict.members.errorFetch);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refresh(page, search);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  function onSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPage(1);
    refresh(1, search);
  }

  async function handleExport() {
    setExporting(true);
    try {
      await downloadMembersCsv();
    } finally {
      setExporting(false);
    }
  }

  function openCreate() {
    setForm(emptyForm);
    setFormError(null);
    setEditingId('new');
  }

  function openEdit(item: MemberListItem) {
    setForm(toForm(item));
    setFormError(null);
    setEditingId(item._id);
  }

  async function onFormSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setFormError(null);
    try {
      if (editingId === 'new') {
        await createMember(form);
      } else if (editingId) {
        const { password, ...rest } = form;
        await updateMember(editingId, password ? form : rest);
      }
      setEditingId(null);
      await refresh(page, search);
    } catch (err) {
      setFormError(apiErrorMessage(err, dict.members.errorSave));
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(item: MemberListItem) {
    if (!window.confirm(dict.members.confirmDelete(item.profile.firstName))) return;
    setDeletingId(item._id);
    try {
      await deleteMember(item._id);
      await refresh(page, search);
    } catch (err) {
      setError(apiErrorMessage(err, dict.members.errorDelete));
    } finally {
      setDeletingId(null);
    }
  }

  const totalPages = Math.max(1, Math.ceil(total / LIMIT));
  const setField = <K extends keyof MemberPayload>(key: K, value: MemberPayload[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  return (
    <div className="flex flex-col gap-4">
      <form onSubmit={onSearchSubmit} className="flex gap-2">
        <div className="flex-1">
          <Input
            id="memberSearch"
            placeholder={dict.members.searchPlaceholder}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button type="submit" className="text-sm">
          {dict.members.search}
        </Button>
        <Button type="button" variant="outline" loading={exporting} onClick={handleExport} className="text-sm">
          {dict.members.export}
        </Button>
        <Button type="button" variant="rose" onClick={openCreate} className="text-sm">
          {dict.members.add}
        </Button>
      </form>

      {editingId && (
        <form onSubmit={onFormSubmit} className="rounded-2xl border border-blue-100 bg-surface p-4 shadow-sm">
          <h3 className="font-semibold text-blue-900">
            {editingId === 'new' ? dict.members.createTitle : dict.members.editTitle}
          </h3>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Input
              id="memberFirstName"
              label={dict.members.columnName}
              value={form.firstName}
              onChange={(e) => setField('firstName', e.target.value)}
              required
            />
            <Input
              id="memberPhone"
              label={dict.members.columnPhone}
              value={form.phoneNumber}
              onChange={(e) => setField('phoneNumber', e.target.value)}
              required
            />
            <Input
              id="memberEmail"
              type="email"
              label={dict.members.columnEmail}
              value={form.email}
              onChange={(e) => setField('email', e.target.value)}
              required
            />
            <Input
              id="memberPassword"
              type="password"
              label={dict.members.passwordLabel}
              placeholder={editingId === 'new' ? undefined : dict.members.passwordEditHint}
              minLength={8}
              value={form.password}
              onChange={(e) => setField('password', e.target.value)}
              required={editingId === 'new'}
            />
            <Select
              id="memberGender"
              label={dict.members.genderLabel}
              value={form.gender}
              onChange={(e) => setField('gender', e.target.value as MemberPayload['gender'])}
              options={[
                { value: 'MALE', label: dict.members.genderMale },
                { value: 'FEMALE', label: dict.members.genderFemale },
              ]}
            />
            <Input
              id="memberBirthDate"
              type="date"
              label={dict.members.birthDateLabel}
              value={form.birthDate}
              onChange={(e) => setField('birthDate', e.target.value)}
              required
            />
            <Input
              id="memberCity"
              label={dict.members.columnCity}
              value={form.currentCity}
              onChange={(e) => setField('currentCity', e.target.value)}
              required
            />
            <Input
              id="memberCountry"
              label={dict.members.columnCountry}
              value={form.residenceCountry}
              onChange={(e) => setField('residenceCountry', e.target.value)}
              required
            />
            <Input
              id="memberOriginCountry"
              label={dict.members.originCountryLabel}
              value={form.originCountry}
              onChange={(e) => setField('originCountry', e.target.value)}
              required
            />
            <Select
              id="memberTier"
              label={dict.members.columnTier}
              value={form.subscriptionTier}
              onChange={(e) => setField('subscriptionTier', e.target.value)}
              options={TIERS.map((value) => ({ value, label: value }))}
            />
            <Select
              id="memberVerification"
              label={dict.members.columnVerification}
              value={form.verificationStatus}
              onChange={(e) => setField('verificationStatus', e.target.value)}
              options={VERIFICATION_STATUSES.map((value) => ({ value, label: value }))}
            />
            <Input
              id="memberCoins"
              type="number"
              min={0}
              label={dict.members.columnCoins}
              value={form.coinBalance}
              onChange={(e) => setField('coinBalance', Number(e.target.value))}
              required
            />
          </div>
          {formError && <p className="mt-2 text-sm text-red-500">{formError}</p>}
          <div className="mt-4 flex gap-2">
            <Button type="submit" loading={saving} className="text-sm">
              {dict.members.save}
            </Button>
            <Button type="button" variant="ghost" onClick={() => setEditingId(null)} className="text-sm">
              {dict.members.cancel}
            </Button>
          </div>
        </form>
      )}

      {loading ? (
        <p className="text-sm text-ink-500">{dict.common.loading}</p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-blue-100 bg-surface shadow-sm">
          {error && <p className="p-4 text-sm text-red-500">{error}</p>}
          <table className="w-full min-w-[980px] text-sm">
            <thead>
              <tr className="border-b border-blue-100 text-right text-ink-500">
                <th className="px-4 py-3 font-medium">{dict.members.columnName}</th>
                <th className="px-4 py-3 font-medium">{dict.members.columnPhone}</th>
                <th className="px-4 py-3 font-medium">{dict.members.columnEmail}</th>
                <th className="px-4 py-3 font-medium">{dict.members.columnCity}</th>
                <th className="px-4 py-3 font-medium">{dict.members.columnCountry}</th>
                <th className="px-4 py-3 font-medium">{dict.members.columnVerification}</th>
                <th className="px-4 py-3 font-medium">{dict.members.columnTier}</th>
                <th className="px-4 py-3 font-medium">{dict.members.columnCoins}</th>
                <th className="px-4 py-3 font-medium">{dict.members.columnJoined}</th>
                <th className="px-4 py-3 font-medium">{dict.members.columnActions}</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item._id} className="border-b border-blue-50 last:border-0">
                  <td className="px-4 py-3 font-semibold text-blue-900">
                    {item.profile.firstName}, {calculateAge(item.profile.birthDate)}
                  </td>
                  <td className="px-4 py-3 font-mono">{item.phoneNumber}</td>
                  <td className="px-4 py-3">{item.email ?? '—'}</td>
                  <td className="px-4 py-3">{item.profile.currentCity}</td>
                  <td className="px-4 py-3">{item.profile.residenceCountry}</td>
                  <td className="px-4 py-3">{item.verificationStatus}</td>
                  <td className="px-4 py-3">{item.subscriptionTier}</td>
                  <td className="px-4 py-3">{item.coinBalance}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{new Date(item.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex gap-1">
                      <Button type="button" variant="ghost" onClick={() => openEdit(item)} className="px-3 py-1.5 text-xs">
                        {dict.members.edit}
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        loading={deletingId === item._id}
                        onClick={() => handleDelete(item)}
                        className="px-3 py-1.5 text-xs text-red-500"
                      >
                        {dict.members.delete}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr>
                  <td colSpan={10} className="px-4 py-6 text-center text-ink-500">
                    {dict.members.empty}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {!loading && total > 0 && (
        <div className="flex items-center justify-between text-sm text-ink-500">
          <span>{dict.members.totalCount(total)}</span>
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="ghost"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="text-xs"
            >
              {dict.members.prev}
            </Button>
            <span>{dict.members.pageOf(page, totalPages)}</span>
            <Button
              type="button"
              variant="ghost"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="text-xs"
            >
              {dict.members.next}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
