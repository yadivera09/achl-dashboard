'use client';

// ─── WorkdayCard Component ──────────────────────────────────────
// Central workday control: Check-in/Check-out/Break buttons + timer.
// Shows the current workday status with a prominent action button.

import React, { useState, useEffect, useCallback } from 'react';
import { useSessionStore } from '@/stores/sessionStore';
import { formatDuration, elapsedSeconds, formatTime, breakTypeLabel } from '@/lib/utils';
import type { BreakType } from '@/lib/types';

const BREAK_TYPES: { value: BreakType; label: string; icon: string }[] = [
    { value: 'rest', label: 'Descanso', icon: '☕' },
    { value: 'lunch', label: 'Almuerzo', icon: '🍽️' },
    { value: 'medical', label: 'Médico', icon: '🏥' },
    { value: 'other', label: 'Otro', icon: '⏸️' },
];

export default function WorkdayCard() {
    const {
        currentSession,
        breaks,
        workdayStatus,
        checkIn,
        checkOut,
        startBreak,
        endBreak,
    } = useSessionStore();

    const [elapsed, setElapsed] = useState(0);
    const [breakElapsed, setBreakElapsed] = useState(0);
    const [showBreakMenu, setShowBreakMenu] = useState(false);

    const activeBreak = breaks.find((b) => b.ended_at === null) ?? null;

    // Main timer: total working seconds (excluding pauses)
    const computeNetElapsed = useCallback(() => {
        if (!currentSession) return 0;
        const totalElapsed = elapsedSeconds(currentSession.check_in, currentSession.check_out);

        // Subtract completed breaks
        const completedBreakSeconds = breaks
            .filter((b) => b.ended_at !== null)
            .reduce((acc, b) => acc + (b.duration_minutes ?? 0) * 60, 0);

        // Subtract current active break (if any)
        const activeBreakSeconds = activeBreak
            ? elapsedSeconds(activeBreak.started_at, null)
            : 0;

        return Math.max(0, totalElapsed - completedBreakSeconds - activeBreakSeconds);
    }, [currentSession, breaks, activeBreak]);

    useEffect(() => {
        if (workdayStatus === 'idle' || workdayStatus === 'completed') return;

        setElapsed(computeNetElapsed());

        const interval = setInterval(() => {
            setElapsed(computeNetElapsed());
            if (activeBreak) {
                setBreakElapsed(elapsedSeconds(activeBreak.started_at, null));
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [workdayStatus, computeNetElapsed, activeBreak]);

    const totalPauseMinutes = breaks.reduce(
        (acc, b) => acc + (b.duration_minutes ?? 0),
        0
    );

    const handleBreakSelect = (breakType: BreakType) => {
        startBreak(breakType);
        setShowBreakMenu(false);
    };

    return (
        <div className="workday-card glass-elevated animate-fade-in">
            {/* Status indicator */}
            <div className="workday-card__status">
                <span className={`status-dot status-dot--${workdayStatus === 'on_break' ? 'break' : workdayStatus}`} />
                <span className="workday-card__status-label">
                    {workdayStatus === 'idle' && 'Sin iniciar'}
                    {workdayStatus === 'active' && 'Jornada activa'}
                    {workdayStatus === 'on_break' && `En pausa — ${activeBreak ? breakTypeLabel(activeBreak.break_type) : ''}`}
                    {workdayStatus === 'completed' && 'Jornada finalizada'}
                </span>
            </div>

            {/* Timer display */}
            <div className="workday-card__timer">
                <span className={`workday-card__time ${workdayStatus === 'active' ? 'workday-card__time--active' : ''}`}>
                    {formatDuration(workdayStatus === 'completed' && currentSession ? (currentSession.net_minutes ?? 0) * 60 : elapsed)}
                </span>
                <span className="workday-card__timer-label">
                    {workdayStatus === 'on_break' ? 'Tiempo neto trabajado' : 'Horas trabajadas'}
                </span>
            </div>

            {/* Break timer (when on break) */}
            {workdayStatus === 'on_break' && (
                <div className="workday-card__break-timer">
                    <span className="workday-card__break-time">{formatDuration(breakElapsed)}</span>
                    <span className="workday-card__break-label">Tiempo en pausa</span>
                </div>
            )}

            {/* Action buttons */}
            <div className="workday-card__actions">
                {workdayStatus === 'idle' && (
                    <button className="workday-btn workday-btn--checkin" onClick={checkIn} id="btn-checkin">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                            <polyline points="10 17 15 12 10 7" />
                            <line x1="15" y1="12" x2="3" y2="12" />
                        </svg>
                        Check-in
                    </button>
                )}

                {workdayStatus === 'active' && (
                    <>
                        <button className="workday-btn workday-btn--checkout" onClick={checkOut} id="btn-checkout">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                                <polyline points="16 17 21 12 16 7" />
                                <line x1="21" y1="12" x2="9" y2="12" />
                            </svg>
                            Check-out
                        </button>
                        <div className="workday-card__break-container">
                            <button
                                className="workday-btn workday-btn--break"
                                onClick={() => setShowBreakMenu(!showBreakMenu)}
                                id="btn-start-break"
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="6" y="4" width="4" height="16" rx="1" />
                                    <rect x="14" y="4" width="4" height="16" rx="1" />
                                </svg>
                                Pausa
                            </button>
                            {showBreakMenu && (
                                <div className="break-menu glass-elevated">
                                    {BREAK_TYPES.map((bt) => (
                                        <button
                                            key={bt.value}
                                            className="break-menu__item"
                                            onClick={() => handleBreakSelect(bt.value)}
                                        >
                                            <span>{bt.icon}</span>
                                            <span>{bt.label}</span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </>
                )}

                {workdayStatus === 'on_break' && (
                    <button className="workday-btn workday-btn--resume" onClick={endBreak} id="btn-end-break">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polygon points="5 3 19 12 5 21 5 3" />
                        </svg>
                        Retomar jornada
                    </button>
                )}

                {workdayStatus === 'completed' && (
                    <div className="workday-card__completed-info">
                        <span>✅ Jornada completada</span>
                        {currentSession && (
                            <span className="workday-card__completed-time">
                                {formatTime(currentSession.check_in)} — {currentSession.check_out ? formatTime(currentSession.check_out) : ''}
                            </span>
                        )}
                    </div>
                )}
            </div>

            {/* Summary strip */}
            {currentSession && (
                <div className="workday-card__summary">
                    <div className="workday-card__summary-item">
                        <span className="workday-card__summary-label">Entrada</span>
                        <span className="workday-card__summary-value">{formatTime(currentSession.check_in)}</span>
                    </div>
                    <div className="workday-card__summary-item">
                        <span className="workday-card__summary-label">Pausas</span>
                        <span className="workday-card__summary-value">{breaks.length} ({totalPauseMinutes} min)</span>
                    </div>
                    {currentSession.check_out && (
                        <div className="workday-card__summary-item">
                            <span className="workday-card__summary-label">Salida</span>
                            <span className="workday-card__summary-value">{formatTime(currentSession.check_out)}</span>
                        </div>
                    )}
                </div>
            )}

            <style jsx>{`
        .workday-card {
          padding: var(--space-xl);
          display: flex;
          flex-direction: column;
          gap: var(--space-lg);
        }

        .workday-card__status {
          display: flex;
          align-items: center;
          gap: var(--space-sm);
        }

        .workday-card__status-label {
          font-size: 0.85rem;
          color: var(--text-secondary);
          font-weight: 500;
        }

        .workday-card__timer {
          text-align: center;
          padding: var(--space-lg) 0;
        }

        .workday-card__time {
          font-size: 3.5rem;
          font-weight: 800;
          letter-spacing: 0.05em;
          color: var(--text-primary);
          font-variant-numeric: tabular-nums;
          display: block;
        }

        .workday-card__time--active {
          background: linear-gradient(135deg, var(--status-active), #34D399);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .workday-card__timer-label {
          font-size: 0.75rem;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin-top: var(--space-xs);
          display: block;
        }

        .workday-card__break-timer {
          text-align: center;
          padding: var(--space-sm);
          background: var(--status-break-glow);
          border-radius: var(--radius-md);
          border: 1px solid rgba(245, 158, 11, 0.2);
        }

        .workday-card__break-time {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--status-break);
          font-variant-numeric: tabular-nums;
        }

        .workday-card__break-label {
          font-size: 0.7rem;
          color: var(--status-break);
          text-transform: uppercase;
          letter-spacing: 0.08em;
          display: block;
          margin-top: 2px;
        }

        .workday-card__actions {
          display: flex;
          gap: var(--space-sm);
          justify-content: center;
          flex-wrap: wrap;
        }

        .workday-btn {
          display: flex;
          align-items: center;
          gap: var(--space-sm);
          padding: var(--space-sm) var(--space-lg);
          border-radius: var(--radius-md);
          border: none;
          font-family: inherit;
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          transition: all var(--transition-fast);
          white-space: nowrap;
        }

        .workday-btn--checkin {
          background: var(--status-active);
          color: white;
          padding: var(--space-md) var(--space-2xl);
          font-size: 1.1rem;
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-glow-green);
        }
        .workday-btn--checkin:hover {
          filter: brightness(1.1);
          transform: translateY(-1px);
        }

        .workday-btn--checkout {
          background: var(--status-danger);
          color: white;
        }
        .workday-btn--checkout:hover {
          filter: brightness(1.1);
        }

        .workday-btn--break {
          background: var(--bg-surface);
          color: var(--status-break);
          border: 1px solid rgba(245, 158, 11, 0.3);
        }
        .workday-btn--break:hover {
          background: var(--status-break-glow);
        }

        .workday-btn--resume {
          background: var(--status-active);
          color: white;
          padding: var(--space-md) var(--space-xl);
        }
        .workday-btn--resume:hover {
          filter: brightness(1.1);
        }

        .workday-card__break-container {
          position: relative;
        }

        .break-menu {
          position: absolute;
          top: calc(100% + 8px);
          left: 50%;
          transform: translateX(-50%);
          padding: var(--space-sm);
          display: flex;
          flex-direction: column;
          gap: 2px;
          min-width: 160px;
          z-index: 10;
          animation: fadeIn 150ms ease-out;
        }

        .break-menu__item {
          display: flex;
          align-items: center;
          gap: var(--space-sm);
          padding: var(--space-sm) var(--space-md);
          border: none;
          background: none;
          color: var(--text-primary);
          font-family: inherit;
          font-size: 0.85rem;
          cursor: pointer;
          border-radius: var(--radius-sm);
          transition: background var(--transition-fast);
        }

        .break-menu__item:hover {
          background: var(--bg-surface-hover);
        }

        .workday-card__completed-info {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--space-xs);
          color: var(--status-completed);
          font-weight: 600;
        }

        .workday-card__completed-time {
          font-size: 0.8rem;
          color: var(--text-muted);
          font-weight: 400;
        }

        .workday-card__summary {
          display: flex;
          justify-content: space-around;
          padding-top: var(--space-md);
          border-top: 1px solid var(--border-subtle);
        }

        .workday-card__summary-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
        }

        .workday-card__summary-label {
          font-size: 0.7rem;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }

        .workday-card__summary-value {
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--text-primary);
        }
      `}</style>
        </div>
    );
}
