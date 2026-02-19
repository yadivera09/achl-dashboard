'use client';

// ─── RecentSessions Component ───────────────────────────────────
// Shows the last 5 completed work sessions.

import React from 'react';
import { useSessionStore } from '@/stores/sessionStore';
import { formatDate, formatTime, formatDuration, dayOfWeekShort } from '@/lib/utils';

export default function RecentSessions() {
  const recentSessions = useSessionStore((s) => s.recentSessions);
  const sessions = recentSessions.slice(0, 5);

  return (
    <div className="recent-sessions glass-elevated">
      <h3 className="recent-sessions__title">Últimas jornadas</h3>

      {sessions.length === 0 ? (
        <p className="recent-sessions__empty">No hay jornadas registradas</p>
      ) : (
        <div className="recent-sessions__list">
          {sessions.map((session) => {
            const hours = session.net_minutes ? (session.net_minutes / 60).toFixed(1) : '—';
            return (
              <div key={session.id} className="recent-session-row">
                <div className="recent-session-row__date">
                  <span className="recent-session-row__day-name">
                    {dayOfWeekShort(session.check_in)}
                  </span>
                  <span className="recent-session-row__day-date">
                    {formatDate(session.check_in)}
                  </span>
                </div>
                <div className="recent-session-row__times">
                  <span>{formatTime(session.check_in)}</span>
                  <span className="recent-session-row__arrow">→</span>
                  <span>{session.check_out ? formatTime(session.check_out) : '—'}</span>
                </div>
                <div className="recent-session-row__duration">
                  {hours}h
                </div>
                <div className={`recent-session-row__status recent-session-row__status--${session.status}`}>
                  {session.status === 'completed' ? '✓' : session.status}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <style jsx>{`
        .recent-sessions {
          padding: var(--space-lg);
        }

        .recent-sessions__title {
          font-size: 1.1rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: var(--space-md);
        }

        .recent-sessions__empty {
          color: var(--text-muted);
          font-size: 0.85rem;
          text-align: center;
          padding: var(--space-xl) 0;
        }

        .recent-sessions__list {
          display: flex;
          flex-direction: column;
          gap: var(--space-xs);
        }

        .recent-session-row {
          display: flex;
          align-items: center;
          gap: var(--space-md);
          padding: var(--space-sm) var(--space-md);
          border-radius: var(--radius-md);
          transition: background var(--transition-fast);
        }

        .recent-session-row:hover {
          background: var(--bg-surface-hover);
        }

        .recent-session-row__date {
          display: flex;
          flex-direction: column;
          min-width: 60px;
        }

        .recent-session-row__day-name {
          font-size: 0.7rem;
          color: var(--text-muted);
          text-transform: capitalize;
        }

        .recent-session-row__day-date {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        .recent-session-row__times {
          flex: 1;
          display: flex;
          align-items: center;
          gap: var(--space-sm);
          font-size: 0.8rem;
          color: var(--text-secondary);
          font-variant-numeric: tabular-nums;
        }

        .recent-session-row__arrow {
          color: var(--text-muted);
        }

        .recent-session-row__duration {
          font-size: 0.9rem;
          font-weight: 700;
          color: var(--accent-secondary);
          min-width: 40px;
          text-align: right;
        }

        .recent-session-row__status {
          width: 24px;
          height: 24px;
          border-radius: var(--radius-full);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.7rem;
        }

        .recent-session-row__status--completed {
          background: var(--status-active-glow);
          color: var(--status-active);
        }
      `}</style>
    </div>
  );
}
