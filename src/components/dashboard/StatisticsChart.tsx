'use client';

// ─── StatisticsChart Component ──────────────────────────────────
// Area chart showing hours worked by day, styled like the UX mockup.
// Purple gradient fill with data points.

import React, { useState } from 'react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';
import { MOCK_WEEKLY_SUMMARY } from '@/lib/mock-data';

type Period = 'days' | 'weeks' | 'months';

// Extended mock for monthly view
const MOCK_MONTHLY_DATA = Array.from({ length: 30 }, (_, i) => ({
    date: '',
    dayLabel: `${i + 1}`,
    hoursWorked: parseFloat((6 + Math.random() * 3).toFixed(1)),
}));

export default function StatisticsChart() {
    const [period, setPeriod] = useState<Period>('days');

    const data = period === 'days' ? MOCK_WEEKLY_SUMMARY : MOCK_MONTHLY_DATA;

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

            {/* Day selector strip */}
            <div className="stats-chart__days">
                {MOCK_WEEKLY_SUMMARY.map((day, i) => (
                    <div
                        key={i}
                        className={`stats-chart__day ${day.dayLabel === 'Hoy' ? 'stats-chart__day--today' : ''}`}
                    >
                        <span className="stats-chart__day-num">{new Date(day.date).getDate().toString().padStart(2, '0')}</span>
                        <span className="stats-chart__day-name">{day.dayLabel}</span>
                    </div>
                ))}
            </div>

            {/* Chart */}
            <div className="stats-chart__canvas">
                <ResponsiveContainer width="100%" height={220}>
                    <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                            <linearGradient id="purpleGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#7C3AED" stopOpacity={0.5} />
                                <stop offset="100%" stopColor="#7C3AED" stopOpacity={0.02} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="rgba(148,163,184,0.08)"
                            vertical={false}
                        />
                        <XAxis
                            dataKey="dayLabel"
                            tick={{ fill: '#64748B', fontSize: 11 }}
                            axisLine={false}
                            tickLine={false}
                        />
                        <YAxis
                            tick={{ fill: '#64748B', fontSize: 11 }}
                            axisLine={false}
                            tickLine={false}
                            domain={[0, 10]}
                            tickFormatter={(v) => `${v}h`}
                        />
                        <Tooltip
                            contentStyle={{
                                background: '#1A1A2E',
                                border: '1px solid rgba(148,163,184,0.15)',
                                borderRadius: '8px',
                                color: '#F1F5F9',
                                fontSize: '0.8rem',
                            }}
                            formatter={(value: number) => [`${value}h`, 'Horas']}
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
                        />
                    </AreaChart>
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

        .stats-chart__day--today .stats-chart__day-name {
          color: rgba(255,255,255,0.8);
        }

        .stats-chart__canvas {
          margin-top: var(--space-sm);
        }
      `}</style>
        </div>
    );
}
