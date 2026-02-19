'use client';

// ─── History Page ───────────────────────────────────────────────
// Paginated table of all work sessions with date filters and CSV export.

import React, { useState, useEffect, useMemo } from 'react';
import AppShell from '@/components/layout/AppShell';
import { supabase } from '@/lib/supabase/client';
import { useAuthStore } from '@/stores/authStore';
import { formatDate, formatTime } from '@/lib/utils';
import type { WorkSession } from '@/lib/types';

export default function HistoryPage() {
  const user = useAuthStore((state) => state.user);
  const [allSessions, setAllSessions] = useState<WorkSession[]>([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isLoadingData, setIsLoadingData] = useState(true);

  // Load all sessions from Supabase
  useEffect(() => {
    if (!user?.id) return;
    setIsLoadingData(true);
    supabase
      .from('work_sessions')
      .select('*')
      .eq('user_id', user.id)
      .order('check_in', { ascending: false })
      .then(({ data }) => {
        setAllSessions((data ?? []) as WorkSession[]);
        setIsLoadingData(false);
      });
  }, [user?.id]);

  const userSessions = useMemo(() => {
    let filtered = allSessions;
    if (startDate) {
      filtered = filtered.filter((s) => s.check_in >= startDate);
    }
    if (endDate) {
      filtered = filtered.filter((s) => s.check_in <= endDate + 'T23:59:59Z');
    }
    return filtered;
  }, [allSessions, startDate, endDate]);

  const exportCSV = () => {
    const headers = 'Fecha,Entrada,Salida,Pausas (min),Horas Netas,Estado\n';
    const rows = userSessions.map((s) => {
      const date = formatDate(s.check_in);
      const checkIn = formatTime(s.check_in);
      const checkOut = s.check_out ? formatTime(s.check_out) : '';
      const pauses = s.pause_minutes;
      const netHours = s.net_minutes ? (s.net_minutes / 60).toFixed(1) : '';
      const status = s.status;
      return `${date},${checkIn},${checkOut},${pauses},${netHours},${status}`;
    }).join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `historial_jornadas_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const totalHours = userSessions.reduce((acc, s) => acc + (s.net_minutes ?? 0), 0) / 60;

  return (
    <AppShell>
      <div className="history-page animate-fade-in">
        <div className="history-page__header">
          <h1 className="history-page__title">Historial de Jornadas</h1>
          <button className="history-page__export" onClick={exportCSV} id="btn-export-csv">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Exportar CSV
          </button>
        </div>

        {/* Filters */}
        <div className="history-page__filters glass-surface">
          <div className="history-page__filter">
            <label htmlFor="filter-start">Desde</label>
            <input
              id="filter-start"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="history-page__date-input"
            />
          </div>
          <div className="history-page__filter">
            <label htmlFor="filter-end">Hasta</label>
            <input
              id="filter-end"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="history-page__date-input"
            />
          </div>
          <div className="history-page__stats">
            <span className="history-page__stat-label">Total: </span>
            <span className="history-page__stat-value">{totalHours.toFixed(1)}h</span>
            <span className="history-page__stat-label"> en </span>
            <span className="history-page__stat-value">{userSessions.length} jornadas</span>
          </div>
        </div>

        {/* Table */}
        <div className="history-table-container glass-elevated">
          <table className="history-table">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Entrada</th>
                <th>Salida</th>
                <th>Pausas</th>
                <th>Horas Netas</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {userSessions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="history-table__empty">
                    No hay jornadas en el período seleccionado
                  </td>
                </tr>
              ) : (
                userSessions.map((session) => (
                  <tr key={session.id}>
                    <td className="history-table__date">{formatDate(session.check_in)}</td>
                    <td>{formatTime(session.check_in)}</td>
                    <td>{session.check_out ? formatTime(session.check_out) : '—'}</td>
                    <td>{session.pause_minutes} min</td>
                    <td className="history-table__hours">
                      {session.net_minutes ? `${(session.net_minutes / 60).toFixed(1)}h` : '—'}
                    </td>
                    <td>
                      <span className={`history-table__status history-table__status--${session.status}`}>
                        {session.status === 'active' ? 'Activa' : session.status === 'completed' ? 'Completada' : 'Editada'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <style jsx>{`
        .history-page {
          display: flex;
          flex-direction: column;
          gap: var(--space-xl);
        }

        .history-page__header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .history-page__title {
          font-size: 1.5rem;
          font-weight: 800;
          color: var(--text-primary);
        }

        .history-page__export {
          display: flex;
          align-items: center;
          gap: var(--space-sm);
          padding: var(--space-sm) var(--space-md);
          background: var(--accent-primary);
          color: white;
          border: none;
          border-radius: var(--radius-md);
          font-family: inherit;
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .history-page__export:hover {
          filter: brightness(1.1);
          box-shadow: var(--shadow-glow-purple);
        }

        .history-page__filters {
          display: flex;
          align-items: flex-end;
          gap: var(--space-lg);
          padding: var(--space-md) var(--space-lg);
          flex-wrap: wrap;
        }

        .history-page__filter {
          display: flex;
          flex-direction: column;
          gap: var(--space-xs);
        }

        .history-page__filter label {
          font-size: 0.75rem;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .history-page__date-input {
          padding: var(--space-sm) var(--space-md);
          background: var(--bg-surface);
          border: 1px solid var(--border-default);
          border-radius: var(--radius-md);
          color: var(--text-primary);
          font-family: inherit;
          font-size: 0.85rem;
          color-scheme: dark;
        }

        .history-page__date-input:focus {
          outline: none;
          border-color: var(--accent-primary);
        }

        .history-page__stats {
          margin-left: auto;
          font-size: 0.85rem;
        }

        .history-page__stat-label {
          color: var(--text-muted);
        }

        .history-page__stat-value {
          color: var(--accent-secondary);
          font-weight: 700;
        }

        .history-table-container {
          overflow-x: auto;
          padding: 0;
        }

        .history-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.85rem;
        }

        .history-table th {
          padding: var(--space-md) var(--space-lg);
          text-align: left;
          font-weight: 600;
          color: var(--text-muted);
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          border-bottom: 1px solid var(--border-subtle);
          white-space: nowrap;
        }

        .history-table td {
          padding: var(--space-md) var(--space-lg);
          border-bottom: 1px solid var(--border-subtle);
          color: var(--text-secondary);
          font-variant-numeric: tabular-nums;
        }

        .history-table tr:hover td {
          background: var(--bg-surface-hover);
        }

        .history-table__date {
          font-weight: 600;
          color: var(--text-primary) !important;
        }

        .history-table__hours {
          font-weight: 700;
          color: var(--accent-secondary) !important;
        }

        .history-table__status {
          padding: 2px 10px;
          border-radius: var(--radius-full);
          font-size: 0.75rem;
          font-weight: 600;
        }

        .history-table__status--active {
          background: var(--status-active-glow);
          color: var(--status-active);
        }

        .history-table__status--completed {
          background: rgba(59, 130, 246, 0.15);
          color: var(--status-completed);
        }

        .history-table__status--edited {
          background: var(--status-break-glow);
          color: var(--status-break);
        }

        .history-table__empty {
          text-align: center;
          color: var(--text-muted);
          padding: var(--space-2xl) !important;
        }

        @media (max-width: 768px) {
          .history-page__header {
            flex-direction: column;
            align-items: flex-start;
            gap: var(--space-md);
          }

          .history-page__stats {
            margin-left: 0;
          }
        }
      `}</style>
    </AppShell>
  );
}
