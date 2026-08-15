'use client';

import { useState } from 'react';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { SearchFilters } from '@/services/matching.service';
import { useAppDict } from '@/hooks/useLocale';

interface SearchFiltersBarProps {
  onSearch: (filters: SearchFilters) => void;
  loading: boolean;
}

export function SearchFiltersBar({ onSearch, loading }: SearchFiltersBarProps) {
  const { dict } = useAppDict();
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
    <div className="flex flex-col gap-3 rounded-3xl border border-blue-100 bg-white p-4 shadow-sm">
      <div className="flex gap-2 rounded-xl bg-blue-50 p-1">
        <button
          type="button"
          onClick={() => selectTab('local')}
          className={`flex-1 rounded-lg py-2 text-sm font-semibold transition ${
            tab === 'local' ? 'bg-rose-500 text-white' : 'text-blue-700'
          }`}
        >
          {dict.searchFilters.local}
        </button>
        <button
          type="button"
          onClick={() => selectTab('diaspora')}
          className={`flex-1 rounded-lg py-2 text-sm font-semibold transition ${
            tab === 'diaspora' ? 'bg-rose-500 text-white' : 'text-blue-700'
          }`}
        >
          {dict.searchFilters.diaspora}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Input
          placeholder={dict.searchFilters.ageFrom}
          type="number"
          value={minAge}
          onChange={(e) => setMinAge(e.target.value)}
        />
        <Input
          placeholder={dict.searchFilters.ageTo}
          type="number"
          value={maxAge}
          onChange={(e) => setMaxAge(e.target.value)}
        />
        <Input
          placeholder={dict.searchFilters.country}
          value={targetCountry}
          onChange={(e) => setTargetCountry(e.target.value)}
        />
        <Input
          placeholder={dict.searchFilters.city}
          value={targetCity}
          onChange={(e) => setTargetCity(e.target.value)}
        />
      </div>

      <Button onClick={() => submit()} loading={loading}>
        {dict.searchFilters.submit}
      </Button>
    </div>
  );
}
