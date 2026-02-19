'use client';

// ─── App Shell Component ────────────────────────────────────────
// Combines Sidebar + Header + main content area.
// Handles the overall page layout structure.

import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

interface AppShellProps {
    children: React.ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
    return (
        <div className="app-shell">
            <Sidebar />
            <Header />
            <main className="app-main">
                {children}
            </main>

            <style jsx>{`
        .app-shell {
          min-height: 100vh;
        }

        .app-main {
          margin-left: var(--sidebar-width);
          margin-top: var(--header-height);
          padding: var(--space-xl);
          min-height: calc(100vh - var(--header-height));
        }

        @media (max-width: 768px) {
          .app-main {
            margin-left: 0;
            margin-bottom: 64px;
            padding: var(--space-md);
          }
        }
      `}</style>
        </div>
    );
}
