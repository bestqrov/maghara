'use client';

import { useState } from 'react';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { SearchFilters } from '@/services/matching.service';

interface SearchFiltersBarProps {
  onSearch: (filters: SearchFilters) => void;
  loading: boolean;
}

export function SearchFiltersBar({ onSearch, loading }: SearchFiltersBarProps) {
  const [tab, setTab] = useState<'local' | 'diaspora'>('local');
  const [minAge, setMinAge] = useState('');
  const [maxAge, setMaxAge] = useState('');
  const [targetCountry, setTargetCountry] = useState('');
  const [targetCity, setTargetCity] = useState('');

  function submit(nextTab: 'local' | 'diaspora' = tab) {
    onSearch({
      minAge: minAge ? Number(minAge) : undefined,
      maxAge: maxAge ? Number(maxAge) : undefined,
      targetCountry: targetCountry || undefined,
      targetCity: targetCity || undefined,
      scope: nextTab === 'diaspora' ? 'DIASPORA' : 'LOCAL',
    });
  }

  function selectTab(nextTab: 'local' | 'diaspora') {
    setTab(nextTab);
    submit(nextTab);
  }

  return (
    <div className="flex flex-col gap-3 rounded-3xl bg-white p-4 shadow-sm">
      <div className="flex gap-2 rounded-xl bg-emerald-50 p-1">
        <button
          type="button"
          onClick={() => selectTab('local')}
          className={`flex-1 rounded-lg py-2 text-sm font-semibold transition ${
            tab === 'local' ? 'bg-emerald-600 text-white' : 'text-emerald-700'
          }`}
        >
          البحث المحلي
        </button>
        <button
          type="button"
          onClick={() => selectTab('diaspora')}
          className={`flex-1 rounded-lg py-2 text-sm font-semibold transition ${
            tab === 'diaspora' ? 'bg-emerald-600 text-white' : 'text-emerald-700'
          }`}
        >
          الجالية / الزواج الدولي
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Input placeholder="السن من" type="number" value={minAge} onChange={(e) => setMinAge(e.target.value)} />
        <Input placeholder="السن إلى" type="number" value={maxAge} onChange={(e) => setMaxAge(e.target.value)} />
        <Input placeholder="البلد" value={targetCountry} onChange={(e) => setTargetCountry(e.target.value)} />
        <Input placeholder="المدينة" value={targetCity} onChange={(e) => setTargetCity(e.target.value)} />
      </div>

      <Button onClick={() => submit()} loading={loading}>
        بحث
      </Button>
    </div>
  );
}
