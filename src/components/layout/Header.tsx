'use client';

// ─── Header Component ───────────────────────────────────────────
// Top bar with search, employee status summary, and user profile link.

import React, { useMemo } from 'react';
import Link from 'next/link';
import { Search, LogOut } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { useRouter } from 'next/navigation';
import { getMockEmployeeStatuses } from '@/lib/mock-data';

export default function Header() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const statuses = useMemo(() => getMockEmployeeStatuses(), []);

  const onWork = statuses.filter((s) => s.workdayStatus === 'active').length;
  const onBreak = statuses.filter((s) => s.workdayStatus === 'on_break').length;
  const total = statuses.length;

  const initials = user?.full_name
    ? user.full_name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase()
    : 'U';

  const roleLabel =
    user?.role === 'admin'
      ? 'Administrador'
      : user?.role === 'supervisor'
        ? 'Supervisor'
        : 'Empleado';

  const handleLogout = async () => {
    await logout();
    router.replace('/login');
  };

  return (
    <header className="app-header" aria-label="Barra de navegación principal">
      {/* Search */}
      <div className="header__search">
        <Search size={18} />
        <input
          type="text"
          placeholder="Buscar empleado..."
          className="header__search-input"
          id="header-search"
        />
      </div>

      {/* Status pills */}
      <div className="header__status-pills">
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

      {/* User — clicking name/avatar goes to /profile */}
      <div className="header__user">
        <div className="header__user-info">
          <span className="header__user-name">{user?.full_name ?? '—'}</span>
          <span className="header__user-role">{roleLabel}</span>
        </div>

        <Link
          href="/profile"
          className="header__avatar"
          aria-label="Ver mi perfil"
          id="btn-user-profile"
          title="Mi perfil"
        >
          {initials}
        </Link>

        <button
          className="header__logout-btn"
          onClick={handleLogout}
          aria-label="Cerrar sesión"
          id="btn-logout"
          title="Cerrar sesión"
        >
          <LogOut size={17} />
        </button>
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
          position: relative;
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
          text-decoration: none;
          flex-shrink: 0;
          transition: box-shadow var(--transition-fast), transform var(--transition-fast);
        }

        .header__avatar:hover {
          box-shadow: var(--shadow-glow-purple);
          transform: scale(1.05);
        }

        .header__logout-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 34px;
          height: 34px;
          border-radius: var(--radius-md);
          background: none;
          border: 1px solid var(--border-subtle);
          color: var(--text-muted);
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .header__logout-btn:hover {
          background: var(--status-danger-glow);
          border-color: var(--status-danger);
          color: var(--status-danger);
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
