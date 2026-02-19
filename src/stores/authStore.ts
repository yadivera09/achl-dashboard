// ─── Auth Store (Zustand) ───────────────────────────────────────
// Manages authentication state with mock user for demo mode.

import { create } from 'zustand';
import { Profile } from '@/lib/types';
import { MOCK_CURRENT_USER } from '@/lib/mock-data';

interface AuthState {
    user: Profile | null;
    isAuthenticated: boolean;
    isLoading: boolean;

    login: (email: string, password: string) => Promise<boolean>;
    logout: () => void;
    updateProfile: (updates: Partial<Profile>) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    // Start authenticated with mock user for demo
    user: MOCK_CURRENT_USER,
    isAuthenticated: true,
    isLoading: false,

    login: async (_email: string, _password: string) => {
        set({ isLoading: true });
        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 800));
        set({ user: MOCK_CURRENT_USER, isAuthenticated: true, isLoading: false });
        return true;
    },

    logout: () => {
        set({ user: null, isAuthenticated: false, isLoading: false });
    },

    updateProfile: (updates: Partial<Profile>) => {
        set((state) => ({
            user: state.user ? { ...state.user, ...updates } : null,
        }));
    },
}));
