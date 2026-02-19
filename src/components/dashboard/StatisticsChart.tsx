'use client';

// ─── StatisticsChart Component ──────────────────────────────────
// Area/bar chart showing hours worked by day, week or month.
// Distinct data sets per period. Days: last 7 days.
// Weeks: last 8 weeks. Months: last 12 months (bar chart).

import React, { useState } from 'react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { MOCK_WEEKLY_SUMMARY } from '@/lib/mock-data';

type Period = 'days' | 'weeks' | 'months';

// Seeded pseudo-random to avoid SSR/client hydration mismatch
function seededRandom(seed: number): number {
  const x = Math.sin(seed * 9301 + 49297) * 49297;
  return x - Math.floor(x);
}

// Weeks: last 8 full weeks
const MOCK_WEEKLY_DATA = Array.from({ length: 8 }, (_, i) => ({
  dayLabel: `S${i + 1}`,
  hoursWorked: parseFloat((32 + seededRandom(i + 10) * 8).toFixed(1)),
}));

// Months: last 12 months
const MONTH_NAMES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
const currentMonth = new Date().getMonth();
const MOCK_MONTHLY_DATA = Array.from({ length: 12 }, (_, i) => {
  const monthIdx = (currentMonth - 11 + i + 12) % 12;
  return {
    dayLabel: MONTH_NAMES[monthIdx],
    hoursWorked: parseFloat((128 + seededRandom(i + 42) * 60).toFixed(1)),
  };
});

export default function StatisticsChart() {
  const [period, setPeriod] = useState<Period>('days');

  const chartData =
    period === 'days'
      ? MOCK_WEEKLY_SUMMARY
      : period === 'weeks'
        ? MOCK_WEEKLY_DATA
        : MOCK_MONTHLY_DATA;

  const yLabel = period === 'months' ? 'h/mes' : 'h';
  const yMax = period === 'months' ? 200 : period === 'weeks' ? 45 : 10;

  return (
    <div className="stats-chart glass-elevated animate-fade-in">
      <div className="stats-chart__header">
        <h2 className="stats-chart__title">Estadísticas</h2>
        <div className="stats-chart__tabs">
          {(['days', 'weeks', 'months'] as Period[]).map((p) => (
            <button
              key={p}
              className={`stats-chart__tab ${period === p ? 'stats-chart__tab--active' : ''}`}
              onClick={() => setPeriod(p)}
            >
              {p === 'days' ? 'Días' : p === 'weeks' ? 'Semanas' : 'Meses'}
            </button>
          ))}
        </div>
      </div>

      {/* Day selector strip — only shown in day view */}
      {period === 'days' && (
        <div className="stats-chart__days">
          {MOCK_WEEKLY_SUMMARY.map((day, i) => (
            <div
              key={i}
              className={`stats-chart__day ${day.dayLabel === 'Hoy' ? 'stats-chart__day--today' : ''}`}
            >
              <span className="stats-chart__day-num">
                {new Date(day.date).getDate().toString().padStart(2, '0')}
              </span>
              <span className="stats-chart__day-name">{day.dayLabel}</span>
            </div>
          ))}
        </div>
      )}

      {/* Week/month summary pill */}
      {period !== 'days' && (
        <div className="stats-chart__summary-pill">
          <span className="stats-chart__summary-label">
            {period === 'weeks' ? 'Últimas 8 semanas' : 'Últimos 12 meses'}
          </span>
          <span className="stats-chart__summary-total">
            {chartData.reduce((a, d) => a + d.hoursWorked, 0).toFixed(0)}h total
          </span>
        </div>
      )}

      {/* Chart — Area for days/weeks, Bar for months */}
      <div className="stats-chart__canvas">
        <ResponsiveContainer width="100%" height={220}>
          {period === 'months' ? (
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#7C3AED" stopOpacity={0.9} />
                  <stop offset="100%" stopColor="#A78BFA" stopOpacity={0.6} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.08)" vertical={false} />
              <XAxis dataKey="dayLabel" tick={{ fill: '#64748B', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748B', fontSize: 11 }} axisLine={false} tickLine={false} domain={[0, yMax]} tickFormatter={(v) => `${v}h`} />
              <Tooltip
                contentStyle={{ background: '#1A1A2E', border: '1px solid rgba(148,163,184,0.15)', borderRadius: '8px', color: '#F1F5F9', fontSize: '0.8rem' }}
                formatter={(value: number) => [`${value}h`, 'Horas']}
              />
              <Bar dataKey="hoursWorked" fill="url(#barGradient)" radius={[4, 4, 0, 0]} />
            </BarChart>
          ) : (
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="purpleGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#7C3AED" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="#7C3AED" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.08)" vertical={false} />
              <XAxis dataKey="dayLabel" tick={{ fill: '#64748B', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748B', fontSize: 11 }} axisLine={false} tickLine={false} domain={[0, yMax]} tickFormatter={(v) => `${v}${yLabel}`} />
              <Tooltip
                contentStyle={{ background: '#1A1A2E', border: '1px solid rgba(148,163,184,0.15)', borderRadius: '8px', color: '#F1F5F9', fontSize: '0.8rem' }}
                formatter={(value: number) => [`${value}${yLabel}`, 'Horas']}
                labelFormatter={(label) => `${label}`}
              />
              <Area
                type="monotone"
                dataKey="hoursWorked"
                stroke="#7C3AED"
                strokeWidth={2.5}
                fill="url(#purpleGradient)"
                dot={{ r: 3, fill: '#7C3AED', strokeWidth: 0 }}
                activeDot={{ r: 5, fill: '#A78BFA', strokeWidth: 2, stroke: '#7C3AED' }}
                isAnimationActive={true}
                animationDuration={600}
                animationEasing="ease-out"
              />
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>

      <style jsx>{`
        .stats-chart {
          padding: var(--space-xl);
        }

        .stats-chart__header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--space-lg);
        }

        .stats-chart__title {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .stats-chart__tabs {
          display: flex;
          gap: 2px;
          background: var(--bg-surface);
          border-radius: var(--radius-md);
          padding: 2px;
        }

        .stats-chart__tab {
          padding: var(--space-xs) var(--space-md);
          border: none;
          background: none;
          color: var(--text-muted);
          font-family: inherit;
          font-size: 0.8rem;
          font-weight: 500;
          cursor: pointer;
          border-radius: var(--radius-sm);
          transition: all var(--transition-fast);
        }

        .stats-chart__tab--active {
          background: var(--accent-primary);
          color: white;
        }

        .stats-chart__summary-pill {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: var(--space-sm) var(--space-md);
          background: var(--bg-surface);
          border-radius: var(--radius-md);
          margin-bottom: var(--space-md);
        }

        .stats-chart__summary-label {
          font-size: 0.8rem;
          color: var(--text-muted);
        }

        .stats-chart__summary-total {
          font-size: 0.9rem;
          font-weight: 700;
          color: var(--accent-secondary);
        }

        .stats-chart__days {
          display: flex;
          gap: var(--space-xs);
          overflow-x: auto;
          padding-bottom: var(--space-md);
          scrollbar-width: none;
        }

        .stats-chart__days::-webkit-scrollbar {
          display: none;
        }

        .stats-chart__day {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: var(--space-sm) var(--space-md);
          border-radius: var(--radius-md);
          min-width: 52px;
          cursor: pointer;
          transition: background var(--transition-fast);
        }

        .stats-chart__day:hover {
          background: var(--bg-surface-hover);
        }

        .stats-chart__day--today {
          background: var(--accent-primary);
        }

        .stats-chart__day-num {
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .stats-chart__day-name {
          font-size: 0.65rem;
          color: var(--text-muted);
          text-transform: capitalize;
        }

        .stats-chart__day--today .stats-chart__day-name,
        .stats-chart__day--today .stats-chart__day-num {
          color: white;
        }

        .stats-chart__canvas {
          margin-top: var(--space-sm);
        }
      `}</style>
    </div>
  );
}
