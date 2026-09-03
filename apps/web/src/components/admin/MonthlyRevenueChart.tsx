'use client';

import { useState } from 'react';
import { useAdminDict } from '@/hooks/useAdminLocale';

interface MonthlyRevenueChartProps {
  data: { month: string; total: number }[];
}

function monthLabel(months: string[], key: string): string {
  const [, month] = key.split('-');
  return months[Number(month) - 1] ?? key;
}

/** Rounds a max value up to a clean tick step (multiples of 1/2/5 * 10^n). */
function niceMax(value: number): number {
  if (value <= 0) return 10;
  const exp = Math.floor(Math.log10(value));
  const base = Math.pow(10, exp);
  const fraction = value / base;
  const niceFraction = fraction <= 1 ? 1 : fraction <= 2 ? 2 : fraction <= 5 ? 5 : 10;
  return niceFraction * base;
}

const WIDTH = 640;
const HEIGHT = 220;
const PADDING_LEFT = 56;
const PADDING_BOTTOM = 28;
const PADDING_TOP = 12;

export function MonthlyRevenueChart({ data }: MonthlyRevenueChartProps) {
  const { dict } = useAdminDict();
  const [hovered, setHovered] = useState<number | null>(null);

  const max = niceMax(Math.max(...data.map((d) => d.total), 1));
  const ticks = [0, max * 0.25, max * 0.5, max * 0.75, max];
  const plotWidth = WIDTH - PADDING_LEFT - 16;
  const plotHeight = HEIGHT - PADDING_TOP - PADDING_BOTTOM;
  const bandWidth = plotWidth / data.length;
  const barWidth = Math.min(28, bandWidth * 0.55);

  function y(value: number) {
    return PADDING_TOP + plotHeight - (value / max) * plotHeight;
  }

  return (
    <div className="relative w-full overflow-x-auto">
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="w-full min-w-[480px]"
        role="img"
        aria-label={dict.analytics.monthlyRevenueTitle}
      >
        {ticks.map((t) => (
          <g key={t}>
            <line
              x1={PADDING_LEFT}
              x2={WIDTH - 16}
              y1={y(t)}
              y2={y(t)}
              stroke="currentColor"
              className="text-ink-500"
              strokeOpacity={0.12}
              strokeWidth={1}
            />
            <text x={PADDING_LEFT - 8} y={y(t)} textAnchor="end" dominantBaseline="middle" className="fill-ink-500 text-[9px]">
              {Math.round(t)}
            </text>
          </g>
        ))}

        {data.map((d, i) => {
          const cx = PADDING_LEFT + bandWidth * i + bandWidth / 2;
          const barHeight = (d.total / max) * plotHeight;
          const barY = PADDING_TOP + plotHeight - barHeight;
          const isHovered = hovered === i;
          return (
            <g key={d.month}>
              <rect
                x={cx - barWidth / 2}
                y={barHeight > 0 ? barY : PADDING_TOP + plotHeight - 1}
                width={barWidth}
                height={Math.max(barHeight, 1)}
                rx={4}
                className={isHovered ? 'fill-emerald-600' : 'fill-emerald-500'}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
              />
              <rect
                x={cx - bandWidth / 2}
                y={PADDING_TOP}
                width={bandWidth}
                height={plotHeight}
                fill="transparent"
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
              />
              <text
                x={cx}
                y={HEIGHT - PADDING_BOTTOM + 16}
                textAnchor="middle"
                className="fill-ink-500 text-[10px] font-medium"
              >
                {monthLabel(dict.months, d.month)}
              </text>
            </g>
          );
        })}

        <line
          x1={PADDING_LEFT}
          x2={WIDTH - 16}
          y1={PADDING_TOP + plotHeight}
          y2={PADDING_TOP + plotHeight}
          stroke="currentColor"
          className="text-ink-500"
          strokeOpacity={0.25}
          strokeWidth={1}
        />
      </svg>

      {hovered !== null && (
        <div
          className="pointer-events-none absolute rounded-lg bg-blue-900 px-2.5 py-1.5 text-xs font-semibold text-white shadow-lg"
          style={{
            left: `${((PADDING_LEFT + bandWidth * hovered + bandWidth / 2) / WIDTH) * 100}%`,
            top: `${(y(data[hovered].total) / HEIGHT) * 100}%`,
            transform: 'translate(-50%, -130%)',
          }}
        >
          {monthLabel(dict.months, data[hovered].month)}: {data[hovered].total.toLocaleString('en-US')} MAD
        </div>
      )}
    </div>
  );
}
