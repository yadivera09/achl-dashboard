'use client';

// ─── BreakPanel Component ───────────────────────────────────────
// Right panel showing employees currently on break.
// Matches the "Break" section from the UX mockup.

import React, { useState, useEffect } from 'react';
import { getMockEmployeeStatuses } from '@/lib/mock-data';
import { formatDuration, elapsedSeconds, breakTypeLabel } from '@/lib/utils';
import type { EmployeeStatus } from '@/lib/types';

function BreakItem({ employee }: { employee: EmployeeStatus }) {
    const [elapsed, setElapsed] = useState(0);

    useEffect(() => {
        if (!employee.currentBreak) return;
        const update = () =>
            setElapsed(elapsedSeconds(employee.currentBreak!.started_at, null));
        update();
        const interval = setInterval(update, 1000);
        return () => clearInterval(interval);
    }, [employee.currentBreak]);

    if (!employee.currentBreak) return null;

    const initials = employee.profile.full_name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2);

    return (
        <div className="break-item">
            <div className="break-item__avatar">{initials}</div>
            <div className="break-item__info">
                <span className="break-item__name">{employee.profile.full_name}</span>
                <span className="break-item__type">
                    {breakTypeLabel(employee.currentBreak.break_type)}
                </span>
            </div>
            <span className="break-item__time">{formatDuration(elapsed)}</span>

            <style jsx>{`
        .break-item {
          display: flex;
          align-items: center;
          gap: var(--space-sm);
          padding: var(--space-sm) var(--space-md);
          border-radius: var(--radius-md);
          transition: background var(--transition-fast);
        }

        .break-item:hover {
          background: var(--bg-surface-hover);
        }

        .break-item__avatar {
          width: 36px;
          height: 36px;
          border-radius: var(--radius-full);
          background: var(--bg-surface-elevated);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 0.75rem;
          color: var(--text-secondary);
        }

        .break-item__info {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .break-item__name {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        .break-item__type {
          font-size: 0.7rem;
          color: var(--text-muted);
        }

        .break-item__time {
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--status-break);
          background: var(--status-break-glow);
          padding: 2px 8px;
          border-radius: var(--radius-full);
          font-variant-numeric: tabular-nums;
        }
      `}</style>
        </div>
    );
}

export default function BreakPanel() {
    const statuses = getMockEmployeeStatuses();
    const onBreak = statuses.filter((s) => s.workdayStatus === 'on_break');

    return (
        <div className="break-panel glass-elevated">
            <h3 className="break-panel__title">
                En pausa
                <span className="break-panel__count">{onBreak.length}</span>
            </h3>
            {onBreak.length === 0 ? (
                <p className="break-panel__empty">Ningún empleado en pausa</p>
            ) : (
                <div className="break-panel__list">
                    {onBreak.map((emp) => (
                        <BreakItem key={emp.profile.id} employee={emp} />
                    ))}
                </div>
            )}

            <style jsx>{`
        .break-panel {
          padding: var(--space-lg);
        }

        .break-panel__title {
          font-size: 1.1rem;
          font-weight: 700;
          color: var(--text-primary);
          display: flex;
          align-items: center;
          gap: var(--space-sm);
          margin-bottom: var(--space-md);
        }

        .break-panel__count {
          background: var(--status-break-glow);
          color: var(--status-break);
          font-size: 0.75rem;
          padding: 2px 8px;
          border-radius: var(--radius-full);
          font-weight: 600;
        }

        .break-panel__list {
          display: flex;
          flex-direction: column;
          gap: var(--space-xs);
        }

        .break-panel__empty {
          color: var(--text-muted);
          font-size: 0.85rem;
          text-align: center;
          padding: var(--space-xl) 0;
        }
      `}</style>
        </div>
    );
}
