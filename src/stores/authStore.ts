// ─── Auth Store (Zustand) — Real Supabase Auth ─────────────────
// Manages authentication state with live Supabase sessions.
// Replaces mock user with real auth.users + profiles integration.

import { create } from 'zustand';
import { supabase } from '@/lib/supabase/client';
import { Profile } from '@/lib/types';

interface AuthState {
    user: Profile | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    isInitialized: boolean;

    initialize: () => Promise<void>;
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => Promise<void>;
    updateProfile: (updates: Partial<Profile>) => Promise<boolean>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
    user: null,
    isAuthenticated: false,
    isLoading: false,
    isInitialized: false,

    // Called once on app mount — checks for an existing session
    initialize: async () => {
        if (get().isInitialized) return;
        set({ isLoading: true });
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user) {
                const profile = await fetchProfile(session.user)
                    ?? buildFallbackProfile(session.user);
                set({ user: profile, isAuthenticated: true });
            }

            // Listen for auth state changes (login, logout, token refresh)
            supabase.auth.onAuthStateChange(async (_event, session) => {
                if (session?.user) {
                    const profile = await fetchProfile(session.user)
                        ?? buildFallbackProfile(session.user);
                    set({ user: profile, isAuthenticated: true });
                } else {
                    set({ user: null, isAuthenticated: false });
                }
            });
        } finally {
            set({ isLoading: false, isInitialized: true });
        }
    },


    login: async (email: string, password: string) => {
        set({ isLoading: true });
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error || !data.session) {
                return false;
            }

            const profile = await fetchProfile(data.session.user)
                ?? buildFallbackProfile(data.session.user);
            set({ user: profile, isAuthenticated: true });
            return true;
        } catch {
            return false;
        } finally {
            set({ isLoading: false });
        }
    },

    logout: async () => {
        await supabase.auth.signOut();
        set({ user: null, isAuthenticated: false });
    },

    updateProfile: async (updates: Partial<Profile>) => {
        const { user } = get();
        if (!user) return false;

        const { error } = await supabase
            .from('profiles')
            .update(updates)
            .eq('id', user.id);

        if (error) return false;

        set((state) => ({
            user: state.user ? { ...state.user, ...updates } : null,
        }));
        return true;
    },
}));

// ─── Private helpers ─────────────────────────────────────────────

async function fetchProfile(authUser: { id: string; email?: string }): Promise<Profile | null> {
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single();

    if (error) {
        // PGRST116 = row not found (profile trigger may not have run yet)
        if (error.code !== 'PGRST116') {
            console.error('[authStore] fetchProfile error:', error.message);
        }
        return null;
    }
    // Merge email from auth.users (not stored in profiles table)
    return { ...data, email: authUser.email ?? '' } as Profile;
}

/**
 * Builds a minimal Profile from a Supabase auth.User when the profiles
 * table row hasn't been created yet (e.g. trigger hasn't run, email not confirmed).
 * This ensures user.id is always populated after login.
 */
function buildFallbackProfile(authUser: { id: string; email?: string; user_metadata?: Record<string, string> }): Profile {
    const meta = authUser.user_metadata ?? {};
    return {
        id: authUser.id,
        full_name: meta.full_name ?? authUser.email?.split('@')[0] ?? 'Usuario',
        email: authUser.email ?? '',
        role: 'employee',
        timezone: 'America/Bogota',
        avatar_url: null,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    } as Profile;
}
