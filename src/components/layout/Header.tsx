'use client';

// ─── Header Component ───────────────────────────────────────────
// Top bar with search, employee status summary, and user profile.
// Matches the UX mockup header design.

import React from 'react';
import { useAuthStore } from '@/stores/authStore';
import { getMockEmployeeStatuses } from '@/lib/mock-data';

export default function Header() {
    const user = useAuthStore((state) => state.user);
    const statuses = getMockEmployeeStatuses();

    const onWork = statuses.filter((s) => s.workdayStatus === 'active').length;
    const onBreak = statuses.filter((s) => s.workdayStatus === 'on_break').length;
    const total = statuses.length;

    const initials = user?.full_name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase() ?? 'U';

    return (
        <header className="app-header">
            {/* Search */}
            <div className="header__search">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                    type="text"
                    placeholder="Buscar empleado..."
                    className="header__search-input"
                    id="header-search"
                />
            </div>

            {/* Status pills */}
            <div className="header__status-pills">
                {/* Employee avatars cluster */}
                <div className="header__avatar-cluster">
                    {statuses.slice(0, 3).map((s, i) => (
                        <div key={s.profile.id} className="header__mini-avatar" style={{ zIndex: 3 - i, marginLeft: i > 0 ? '-8px' : '0' }}>
                            {s.profile.full_name[0]}
                        </div>
                    ))}
                    {total > 3 && (
                        <div className="header__mini-avatar header__mini-avatar--count" style={{ marginLeft: '-8px' }}>
                            +{total - 3}
                        </div>
                    )}
                </div>

                <div className="header__pill header__pill--active">
                    <span className="status-dot status-dot--active" />
                    <span>{onWork} de {total} trabajando</span>
                </div>

                <div className="header__pill header__pill--break">
                    <span className="status-dot status-dot--break" />
                    <span>{onBreak} en pausa</span>
                </div>
            </div>

            {/* User profile */}
            <div className="header__user">
                <div className="header__user-info">
                    <span className="header__user-name">{user?.full_name}</span>
                    <span className="header__user-role">{user?.role === 'admin' ? 'Administrador' : user?.role === 'supervisor' ? 'Supervisor' : 'Empleado'}</span>
                </div>
                <div className="header__avatar">
                    {initials}
                </div>
            </div>

            <style jsx>{`
        .app-header {
          position: fixed;
          top: 0;
          left: var(--sidebar-width);
          right: 0;
          height: var(--header-height);
          background: var(--bg-secondary);
          border-bottom: 1px solid var(--border-subtle);
          display: flex;
          align-items: center;
          padding: 0 var(--space-xl);
          gap: var(--space-lg);
          z-index: 40;
        }

        .header__search {
          display: flex;
          align-items: center;
          gap: var(--space-sm);
          background: var(--bg-surface);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-full);
          padding: var(--space-sm) var(--space-md);
          color: var(--text-muted);
          width: 240px;
          transition: border-color var(--transition-fast);
        }

        .header__search:focus-within {
          border-color: var(--accent-primary);
        }

        .header__search-input {
          background: none;
          border: none;
          outline: none;
          color: var(--text-primary);
          font-size: 0.875rem;
          width: 100%;
          font-family: inherit;
        }

        .header__search-input::placeholder {
          color: var(--text-muted);
        }

        .header__status-pills {
          display: flex;
          align-items: center;
          gap: var(--space-md);
          flex: 1;
          justify-content: center;
        }

        .header__avatar-cluster {
          display: flex;
          align-items: center;
        }

        .header__mini-avatar {
          width: 28px;
          height: 28px;
          border-radius: var(--radius-full);
          background: var(--bg-surface-elevated);
          border: 2px solid var(--bg-secondary);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.625rem;
          font-weight: 600;
          color: var(--text-secondary);
          position: relative;
        }

        .header__mini-avatar--count {
          background: var(--accent-primary);
          color: white;
          font-size: 0.6rem;
        }

        .header__pill {
          display: flex;
          align-items: center;
          gap: var(--space-sm);
          background: var(--bg-surface);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-full);
          padding: var(--space-xs) var(--space-md);
          font-size: 0.8rem;
          color: var(--text-secondary);
          white-space: nowrap;
        }

        .header__user {
          display: flex;
          align-items: center;
          gap: var(--space-sm);
          margin-left: auto;
        }

        .header__user-info {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
        }

        .header__user-name {
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        .header__user-role {
          font-size: 0.7rem;
          color: var(--text-muted);
          text-transform: capitalize;
        }

        .header__avatar {
          width: 40px;
          height: 40px;
          border-radius: var(--radius-full);
          background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 0.875rem;
          color: white;
          cursor: pointer;
          transition: box-shadow var(--transition-fast);
        }

        .header__avatar:hover {
          box-shadow: var(--shadow-glow-purple);
        }

        @media (max-width: 768px) {
          .app-header {
            left: 0;
            padding: 0 var(--space-md);
          }
          .header__status-pills { display: none; }
          .header__search { width: auto; flex: 1; }
          .header__user-info { display: none; }
        }
      `}</style>
        </header>
    );
}
