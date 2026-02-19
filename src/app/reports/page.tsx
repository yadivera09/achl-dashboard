'use client';

// ─── Reports Page ───────────────────────────────────────────────
// Visual reports with bar charts, summary cards, and period selector.

import React, { useState, useMemo } from 'react';
import AppShell from '@/components/layout/AppShell';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { MOCK_WEEKLY_SUMMARY, MOCK_SESSIONS } from '@/lib/mock-data';

type Period = 'week' | 'month';

// Seeded pseudo-random to avoid SSR/client hydration mismatch
function seededRandom(seed: number): number {
  const x = Math.sin(seed * 9301 + 49297) * 49297;
  return x - Math.floor(x);
}

export default function ReportsPage() {
  const [period, setPeriod] = useState<Period>('week');

  const data = useMemo(() => {
    if (period === 'week') return MOCK_WEEKLY_SUMMARY;
    // Generate 30-day deterministic mock for monthly
    return Array.from({ length: 30 }, (_, i) => ({
      date: '',
      dayLabel: `${i + 1}`,
      hoursWorked: parseFloat((5 + seededRandom(i + 17) * 4).toFixed(1)),
    }));
  }, [period]);

  const userSessions = MOCK_SESSIONS.filter(
    (s) => s.user_id === 'u-001' && s.status === 'completed'
  );

  const totalHours = userSessions.reduce((acc, s) => acc + (s.net_minutes ?? 0), 0) / 60;
  const avgDaily = userSessions.length > 0 ? totalHours / userSessions.length : 0;
  const daysWorked = userSessions.length;
  const daysWithBreaks = userSessions.filter((s) => s.pause_minutes > 0).length;

  const summaryCards = [
    { label: 'Total horas', value: `${totalHours.toFixed(1)}h`, color: 'var(--accent-primary)' },
    { label: 'Promedio diario', value: `${avgDaily.toFixed(1)}h`, color: 'var(--status-active)' },
    { label: 'Días trabajados', value: `${daysWorked}`, color: 'var(--status-completed)' },
    { label: 'Días con pausa', value: `${daysWithBreaks}`, color: 'var(--status-break)' },
  ];

  return (
    <AppShell>
      <div className="reports-page animate-fade-in">
        <div className="reports-page__header">
          <h1 className="reports-page__title">Reportes</h1>
          <div className="reports-page__period-tabs">
            {(['week', 'month'] as Period[]).map((p) => (
              <button
                key={p}
                className={`reports-page__tab ${period === p ? 'reports-page__tab--active' : ''}`}
                onClick={() => setPeriod(p)}
              >
                {p === 'week' ? 'Semana actual' : 'Mes actual'}
              </button>
            ))}
          </div>
        </div>

        {/* Summary cards */}
        <div className="reports-page__cards">
          {summaryCards.map((card) => (
            <div key={card.label} className="report-card glass-elevated">
              <span className="report-card__label">{card.label}</span>
              <span className="report-card__value" style={{ color: card.color }}>
                {card.value}
              </span>
            </div>
          ))}
        </div>

        {/* Bar chart */}
        <div className="reports-page__chart glass-elevated">
          <h2 className="reports-page__chart-title">Horas por día</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
              />
              <Bar
                dataKey="hoursWorked"
                fill="#7C3AED"
                radius={[4, 4, 0, 0]}
                maxBarSize={48}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Detailed sessions table */}
        <div className="reports-page__table glass-elevated">
          <h2 className="reports-page__chart-title">Detalle del período</h2>
          <table className="reports-table">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Horas netas</th>
                <th>Pausas</th>
                <th>Notas</th>
              </tr>
            </thead>
            <tbody>
              {userSessions.map((s) => (
                <tr key={s.id}>
                  <td>
                    {new Date(s.check_in).toLocaleDateString('es-ES', {
                      weekday: 'short', day: 'numeric', month: 'short',
                    })}
                  </td>
                  <td className="reports-table__hours">
                    {s.net_minutes ? `${(s.net_minutes / 60).toFixed(1)}h` : '—'}
                  </td>
                  <td>{s.pause_minutes} min</td>
                  <td className="reports-table__notes">{s.notes || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <style jsx>{`
        .reports-page {
          display: flex;
          flex-direction: column;
          gap: var(--space-xl);
        }

        .reports-page__header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: var(--space-md);
        }

        .reports-page__title {
          font-size: 1.5rem;
          font-weight: 800;
        }

        .reports-page__period-tabs {
          display: flex;
          gap: 2px;
          background: var(--bg-surface);
          border-radius: var(--radius-md);
          padding: 2px;
        }

        .reports-page__tab {
          padding: var(--space-sm) var(--space-md);
          border: none;
          background: none;
          color: var(--text-muted);
          font-family: inherit;
          font-size: 0.85rem;
          font-weight: 500;
          cursor: pointer;
          border-radius: var(--radius-sm);
          transition: all var(--transition-fast);
        }

        .reports-page__tab--active {
          background: var(--accent-primary);
          color: white;
        }

        .reports-page__cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: var(--space-md);
        }

        .report-card {
          padding: var(--space-lg);
          display: flex;
          flex-direction: column;
          gap: var(--space-sm);
        }

        .report-card__label {
          font-size: 0.75rem;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }

        .report-card__value {
          font-size: 2rem;
          font-weight: 800;
        }

        .reports-page__chart {
          padding: var(--space-xl);
        }

        .reports-page__chart-title {
          font-size: 1.1rem;
          font-weight: 700;
          margin-bottom: var(--space-lg);
        }

        .reports-page__table {
          padding: var(--space-xl);
          overflow-x: auto;
        }

        .reports-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.85rem;
        }

        .reports-table th {
          padding: var(--space-sm) var(--space-md);
          text-align: left;
          font-weight: 600;
          color: var(--text-muted);
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          border-bottom: 1px solid var(--border-subtle);
        }

        .reports-table td {
          padding: var(--space-sm) var(--space-md);
          border-bottom: 1px solid var(--border-subtle);
          color: var(--text-secondary);
        }

        .reports-table tr:hover td {
          background: var(--bg-surface-hover);
        }

        .reports-table__hours {
          font-weight: 700;
          color: var(--accent-secondary) !important;
        }

        .reports-table__notes {
          color: var(--text-muted) !important;
          font-style: italic;
        }
      `}</style>
    </AppShell>
  );
}
