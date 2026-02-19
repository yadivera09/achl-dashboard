'use client';

// ─── Dashboard Page ─────────────────────────────────────────────
// Main dashboard with all panels: WorkdayCard, Statistics, Active Sessions, Breaks.
// Layout matches the UX mockup with a two-column design.

import React from 'react';
import AppShell from '@/components/layout/AppShell';
import WorkdayCard from '@/components/dashboard/WorkdayCard';
import StatisticsChart from '@/components/dashboard/StatisticsChart';
import ActiveSessions from '@/components/dashboard/ActiveSessions';
import BreakPanel from '@/components/dashboard/BreakPanel';
import RecentSessions from '@/components/dashboard/RecentSessions';

export default function DashboardPage() {
    return (
        <AppShell>
            <div className="dashboard">
                {/* Main content area (left) */}
                <div className="dashboard__main">
                    <StatisticsChart />
                    <ActiveSessions />
                </div>

                {/* Sidebar panels (right) */}
                <div className="dashboard__sidebar">
                    <WorkdayCard />
                    <BreakPanel />
                    <RecentSessions />
                </div>
            </div>

            <style jsx>{`
        .dashboard {
          display: grid;
          grid-template-columns: 1fr 380px;
          gap: var(--space-xl);
          animation: fadeIn 300ms ease-out;
        }

        .dashboard__main {
          display: flex;
          flex-direction: column;
          gap: var(--space-xl);
          min-width: 0;
        }

        .dashboard__sidebar {
          display: flex;
          flex-direction: column;
          gap: var(--space-xl);
        }

        @media (max-width: 1200px) {
          .dashboard {
            grid-template-columns: 1fr;
          }

          .dashboard__sidebar {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          }
        }

        @media (max-width: 768px) {
          .dashboard__sidebar {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
        </AppShell>
    );
}
