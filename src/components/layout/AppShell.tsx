'use client';

// ─── App Shell Component ────────────────────────────────────────
// Combines Sidebar + Header + main content area.
// Loads the user's session on mount so all dashboard panels have data.

import React, { useEffect } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { useAuthStore } from '@/stores/authStore';
import { useSessionStore } from '@/stores/sessionStore';

interface AppShellProps {
  children: React.ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  const user = useAuthStore((state) => state.user);
  const { loadTodaySession, loadRecentSessions } = useSessionStore();

  // Load today's session whenever the user changes (login)
  useEffect(() => {
    if (user?.id) {
      loadTodaySession(user.id);
      loadRecentSessions(user.id);
    }
  }, [user?.id, loadTodaySession, loadRecentSessions]);

  return (
    <div className="app-shell">
      <Sidebar />
      <Header />
      <main className="app-main" id="main-content">
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
