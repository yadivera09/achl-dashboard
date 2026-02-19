'use client';

// ─── Sidebar Component ──────────────────────────────────────────
// Icon-only dark sidebar matching UX mockup design.
// Navigation items with active indicator (purple highlight).
// Uses lucide-react icons for consistency and accessibility.

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutGrid,
  Clock,
  BarChart3,
  Users,
  Settings,
} from 'lucide-react';

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
}

const NAV_ITEMS: NavItem[] = [
  { href: '/', label: 'Dashboard', icon: <LayoutGrid size={22} /> },
  { href: '/history', label: 'Historial', icon: <Clock size={22} /> },
  { href: '/reports', label: 'Reportes', icon: <BarChart3 size={22} /> },
  { href: '/admin', label: 'Administración', icon: <Users size={22} /> },
];

const BOTTOM_ITEMS: NavItem[] = [
  { href: '/profile', label: 'Configuración', icon: <Settings size={22} /> },
];

export default function Sidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <aside className="sidebar" aria-label="Navegación principal">
      {/* Logo */}
      <div className="sidebar__logo">
        <div className="sidebar__logo-icon">
          <Clock size={28} strokeWidth={2.5} />
        </div>
      </div>

      {/* Main nav */}
      <nav className="sidebar__nav" aria-label="Menú principal">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`sidebar__link ${isActive(item.href) ? 'sidebar__link--active' : ''}`}
            title={item.label}
            aria-label={item.label}
            aria-current={isActive(item.href) ? 'page' : undefined}
          >
            <span className="sidebar__icon">{item.icon}</span>
            {isActive(item.href) && <span className="sidebar__active-indicator" />}
          </Link>
        ))}
      </nav>

      {/* Bottom nav */}
      <nav className="sidebar__bottom" aria-label="Configuración">
        {BOTTOM_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`sidebar__link ${isActive(item.href) ? 'sidebar__link--active' : ''}`}
            title={item.label}
            aria-label={item.label}
            aria-current={isActive(item.href) ? 'page' : undefined}
          >
            <span className="sidebar__icon">{item.icon}</span>
          </Link>
        ))}
      </nav>

      <style jsx>{`
        .sidebar {
          position: fixed;
          left: 0;
          top: 0;
          bottom: 0;
          width: var(--sidebar-width);
          background: var(--bg-secondary);
          border-right: 1px solid var(--border-subtle);
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: var(--space-lg) 0;
          z-index: 50;
        }

        .sidebar__logo {
          margin-bottom: var(--space-2xl);
        }

        .sidebar__logo-icon {
          width: 44px;
          height: 44px;
          border-radius: var(--radius-lg);
          background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          box-shadow: var(--shadow-glow-purple);
        }

        .sidebar__nav {
          display: flex;
          flex-direction: column;
          gap: var(--space-sm);
          flex: 1;
          padding-top: var(--space-sm);
        }

        .sidebar__bottom {
          display: flex;
          flex-direction: column;
          gap: var(--space-sm);
          padding-bottom: var(--space-sm);
        }

        .sidebar__link {
          position: relative;
          width: 48px;
          height: 48px;
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-muted);
          text-decoration: none;
          transition: all var(--transition-fast);
        }

        .sidebar__link:hover {
          color: var(--text-primary);
          background: var(--bg-surface-hover);
        }

        .sidebar__link--active {
          color: var(--accent-primary);
          background: var(--accent-primary-glow);
        }

        .sidebar__link--active:hover {
          color: var(--accent-primary);
          background: var(--accent-primary-glow);
        }

        .sidebar__icon {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .sidebar__active-indicator {
          position: absolute;
          left: -12px;
          top: 50%;
          transform: translateY(-50%);
          width: 3px;
          height: 24px;
          background: var(--accent-primary);
          border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
        }

        @media (max-width: 768px) {
          .sidebar {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            top: auto;
            width: 100%;
            height: 64px;
            flex-direction: row;
            justify-content: space-around;
            padding: 0 var(--space-md);
            border-right: none;
            border-top: 1px solid var(--border-subtle);
          }

          .sidebar__logo { display: none; }
          .sidebar__nav {
            flex-direction: row;
            gap: 0;
            flex: 1;
            justify-content: space-around;
          }
          .sidebar__bottom {
            flex-direction: row;
          }
          .sidebar__active-indicator {
            left: 50%;
            top: auto;
            bottom: -8px;
            transform: translateX(-50%);
            width: 24px;
            height: 3px;
            border-radius: var(--radius-sm) var(--radius-sm) 0 0;
          }
        }
      `}</style>
    </aside>
  );
}
