'use client';

// ─── Sidebar Component ──────────────────────────────────────────
// Icon-only dark sidebar matching UX mockup design.
// Navigation items with active indicator (purple highlight).

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavItem {
    href: string;
    label: string;
    icon: React.ReactNode;
}

const NAV_ITEMS: NavItem[] = [
    {
        href: '/',
        label: 'Dashboard',
        icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" />
                <rect x="14" y="14" width="7" height="7" rx="1" />
            </svg>
        ),
    },
    {
        href: '/history',
        label: 'Historial',
        icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
            </svg>
        ),
    },
    {
        href: '/reports',
        label: 'Reportes',
        icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="20" x2="18" y2="10" />
                <line x1="12" y1="20" x2="12" y2="4" />
                <line x1="6" y1="20" x2="6" y2="14" />
            </svg>
        ),
    },
    {
        href: '/admin',
        label: 'Admin',
        icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
        ),
    },
];

const BOTTOM_ITEMS: NavItem[] = [
    {
        href: '/profile',
        label: 'Perfil',
        icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
        ),
    },
];

export default function Sidebar() {
    const pathname = usePathname();

    const isActive = (href: string) => {
        if (href === '/') return pathname === '/';
        return pathname.startsWith(href);
    };

    return (
        <aside className="sidebar">
            {/* Logo */}
            <div className="sidebar__logo">
                <div className="sidebar__logo-icon">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                    </svg>
                </div>
            </div>

            {/* Main nav */}
            <nav className="sidebar__nav">
                {NAV_ITEMS.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={`sidebar__link ${isActive(item.href) ? 'sidebar__link--active' : ''}`}
                        title={item.label}
                    >
                        <span className="sidebar__icon">{item.icon}</span>
                        {isActive(item.href) && <span className="sidebar__active-indicator" />}
                    </Link>
                ))}
            </nav>

            {/* Bottom nav */}
            <nav className="sidebar__bottom">
                {BOTTOM_ITEMS.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={`sidebar__link ${isActive(item.href) ? 'sidebar__link--active' : ''}`}
                        title={item.label}
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
          gap: var(--space-xs);
          flex: 1;
        }

        .sidebar__bottom {
          display: flex;
          flex-direction: column;
          gap: var(--space-xs);
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
