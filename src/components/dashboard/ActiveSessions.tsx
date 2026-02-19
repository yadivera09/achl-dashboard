'use client';

// ─── ActiveSessions Component ───────────────────────────────────
// Cards showing ongoing employee sessions with timer badges.
// Matches the "Ongoing Calls" section from the UX mockup.

import React, { useState, useEffect } from 'react';
import { getMockEmployeeStatuses } from '@/lib/mock-data';
import { formatDuration, elapsedSeconds } from '@/lib/utils';
import type { EmployeeStatus } from '@/lib/types';

function SessionCard({ employee }: { employee: EmployeeStatus }) {
    const [elapsed, setElapsed] = useState(0);

    useEffect(() => {
        if (!employee.currentSession) return;

        const update = () => {
            setElapsed(elapsedSeconds(employee.currentSession!.check_in, null));
        };
        update();
        const interval = setInterval(update, 1000);
        return () => clearInterval(interval);
    }, [employee.currentSession]);

    if (!employee.currentSession) return null;

    const initials = employee.profile.full_name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2);

    return (
        <div className="session-card glass-surface">
            <div className="session-card__header">
                <div className="session-card__avatar">{initials}</div>
                <div className="session-card__info">
                    <span className="session-card__name">{employee.profile.full_name}</span>
                    <span className={`session-card__badge session-card__badge--${employee.workdayStatus}`}>
                        {formatDuration(elapsed)}
                    </span>
                </div>
            </div>

            <div className="session-card__stats">
                <div className="session-card__stat">
                    <span className={`status-dot status-dot--${employee.workdayStatus}`} />
                    <span>
                        {employee.workdayStatus === 'active' ? 'Trabajando' : 'En pausa'}
                    </span>
                </div>
                <div className="session-card__stat">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                    </svg>
                    <span>{Math.floor(elapsed / 3600)}h {Math.floor((elapsed % 3600) / 60)}m</span>
                </div>
            </div>

            <style jsx>{`
        .session-card {
          padding: var(--space-md);
          display: flex;
          flex-direction: column;
          gap: var(--space-md);
          transition: transform var(--transition-fast), box-shadow var(--transition-fast);
        }

        .session-card:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-md);
        }

        .session-card__header {
          display: flex;
          align-items: center;
          gap: var(--space-sm);
        }

        .session-card__avatar {
          width: 40px;
          height: 40px;
          border-radius: var(--radius-full);
          background: var(--bg-surface-elevated);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 0.8rem;
          color: var(--text-secondary);
          border: 2px solid var(--border-default);
        }

        .session-card__info {
          display: flex;
          flex-direction: column;
          gap: 2px;
          flex: 1;
        }

        .session-card__name {
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        .session-card__badge {
          display: inline-flex;
          align-self: flex-start;
          padding: 2px 8px;
          border-radius: var(--radius-full);
          font-size: 0.7rem;
          font-weight: 600;
          font-variant-numeric: tabular-nums;
        }

        .session-card__badge--active {
          background: var(--status-active-glow);
          color: var(--status-active);
        }

        .session-card__badge--on_break {
          background: var(--status-break-glow);
          color: var(--status-break);
        }

        .session-card__stats {
          display: flex;
          justify-content: space-between;
        }

        .session-card__stat {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 0.75rem;
          color: var(--text-muted);
        }
      `}</style>
        </div>
    );
}

export default function ActiveSessions() {
    const statuses = getMockEmployeeStatuses();
    const activeSessions = statuses.filter(
        (s) => s.workdayStatus === 'active' || s.workdayStatus === 'on_break'
    );

    return (
        <div className="active-sessions">
            <h3 className="active-sessions__title">
                Sesiones activas
                <span className="active-sessions__count">{activeSessions.length}</span>
            </h3>
            <div className="active-sessions__grid">
                {activeSessions.map((emp) => (
                    <SessionCard key={emp.profile.id} employee={emp} />
                ))}
            </div>

            <style jsx>{`
        .active-sessions {
          display: flex;
          flex-direction: column;
          gap: var(--space-md);
        }

        .active-sessions__title {
          font-size: 1.1rem;
          font-weight: 700;
          color: var(--text-primary);
          display: flex;
          align-items: center;
          gap: var(--space-sm);
        }

        .active-sessions__count {
          background: var(--accent-primary-glow);
          color: var(--accent-primary);
          font-size: 0.75rem;
          padding: 2px 8px;
          border-radius: var(--radius-full);
          font-weight: 600;
        }

        .active-sessions__grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
          gap: var(--space-md);
        }
      `}</style>
        </div>
    );
}
