'use client';

// ─── AuthProvider ────────────────────────────────────────────────
// Initializes auth state on app mount and guards protected routes.
// Wrap this around AppShell in layout so all pages get auth context.

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';

export default function AuthProvider({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const { initialize, isAuthenticated, isInitialized, isLoading } = useAuthStore();

    useEffect(() => {
        initialize();
    }, [initialize]);

    // Redirect logic once auth is known
    useEffect(() => {
        if (!isInitialized || isLoading) return;

        const isLoginPage = pathname === '/login';

        if (!isAuthenticated && !isLoginPage) {
            router.replace('/login');
        } else if (isAuthenticated && isLoginPage) {
            router.replace('/');
        }
    }, [isAuthenticated, isInitialized, isLoading, pathname, router]);

    // Show nothing while auth initializes to avoid flashing the login page
    if (!isInitialized) {
        return (
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'var(--bg-primary)',
            }}>
                <div style={{
                    width: 48,
                    height: 48,
                    border: '3px solid var(--border-subtle)',
                    borderTopColor: 'var(--accent-primary)',
                    borderRadius: '50%',
                    animation: 'spin 0.8s linear infinite',
                }} />
                <style>{`
                    @keyframes spin {
                        to { transform: rotate(360deg); }
                    }
                `}</style>
            </div>
        );
    }

    return <>{children}</>;
}
