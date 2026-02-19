// ─── Session Store (Zustand) — Real Supabase Persistence ─────────
// Manages workday lifecycle. All mutations persist to Supabase.
// State: current session, breaks, timer derived from timestamps.

import { create } from 'zustand';
import { supabase } from '@/lib/supabase/client';
import { WorkSession, Break, WorkdayStatus, BreakType } from '@/lib/types';

interface SessionState {
    currentSession: WorkSession | null;
    breaks: Break[];
    workdayStatus: WorkdayStatus;
    recentSessions: WorkSession[];
    isLoading: boolean;

    // Actions
    loadTodaySession: (userId: string) => Promise<void>;
    loadRecentSessions: (userId: string) => Promise<void>;
    checkIn: (userId: string) => Promise<void>;
    checkOut: () => Promise<void>;
    startBreak: (userId: string, breakType: BreakType) => Promise<void>;
    endBreak: () => Promise<void>;
    getActiveBreak: () => Break | null;
}

export const useSessionStore = create<SessionState>((set, get) => ({
    currentSession: null,
    breaks: [],
    workdayStatus: 'idle',
    recentSessions: [],
    isLoading: false,

    // Load today's active session for the logged-in user
    loadTodaySession: async (userId: string) => {
        set({ isLoading: true });
        try {
            const todayStart = new Date();
            todayStart.setHours(0, 0, 0, 0);

            const { data: session, error } = await supabase
                .from('work_sessions')
                .select('*')
                .eq('user_id', userId)
                .eq('status', 'active')
                .gte('check_in', todayStart.toISOString())
                .order('check_in', { ascending: false })
                .limit(1)
                .maybeSingle();

            if (error) throw error;

            if (session) {
                // Load breaks for this session
                const { data: sessionBreaks } = await supabase
                    .from('breaks')
                    .select('*')
                    .eq('session_id', session.id)
                    .order('started_at', { ascending: true });

                const breaks = (sessionBreaks ?? []) as Break[];
                const hasActiveBreak = breaks.some((b) => b.ended_at === null);

                set({
                    currentSession: session as WorkSession,
                    breaks,
                    workdayStatus: hasActiveBreak ? 'on_break' : 'active',
                });
            } else {
                // Check if completed today
                const { data: completedSession } = await supabase
                    .from('work_sessions')
                    .select('*')
                    .eq('user_id', userId)
                    .eq('status', 'completed')
                    .gte('check_in', todayStart.toISOString())
                    .order('check_in', { ascending: false })
                    .limit(1)
                    .maybeSingle();

                if (completedSession) {
                    set({ currentSession: completedSession as WorkSession, workdayStatus: 'completed' });
                } else {
                    set({ currentSession: null, workdayStatus: 'idle' });
                }
            }
        } catch (err) {
            console.error('[sessionStore] loadTodaySession error:', err);
        } finally {
            set({ isLoading: false });
        }
    },

    // Load last 10 completed sessions
    loadRecentSessions: async (userId: string) => {
        try {
            const { data, error } = await supabase
                .from('work_sessions')
                .select('*')
                .eq('user_id', userId)
                .eq('status', 'completed')
                .order('check_in', { ascending: false })
                .limit(10);

            if (error) throw error;
            set({ recentSessions: (data ?? []) as WorkSession[] });
        } catch (err) {
            console.error('[sessionStore] loadRecentSessions error:', err);
        }
    },

    checkIn: async (userId: string) => {
        const now = new Date().toISOString();
        set({ isLoading: true });
        try {
            const { data, error } = await supabase
                .from('work_sessions')
                .insert({
                    user_id: userId,
                    check_in: now,
                    status: 'active',
                    pause_minutes: 0,
                })
                .select()
                .single();

            if (error) throw error;

            set({
                currentSession: data as WorkSession,
                breaks: [],
                workdayStatus: 'active',
            });
        } catch (err) {
            console.error('[sessionStore] checkIn error:', err);
        } finally {
            set({ isLoading: false });
        }
    },

    checkOut: async () => {
        const { currentSession, breaks } = get();
        if (!currentSession) return;

        const now = new Date().toISOString();
        set({ isLoading: true });
        try {
            const checkInMs = new Date(currentSession.check_in).getTime();
            const checkOutMs = Date.now();
            const totalMinutes = Math.floor((checkOutMs - checkInMs) / 60000);

            const totalPauseMinutes = breaks.reduce((acc, b) => {
                if (b.ended_at) return acc + (b.duration_minutes ?? 0);
                return acc;
            }, 0);

            const netMinutes = Math.max(0, totalMinutes - totalPauseMinutes);

            const { data, error } = await supabase
                .from('work_sessions')
                .update({
                    check_out: now,
                    net_minutes: netMinutes,
                    pause_minutes: totalPauseMinutes,
                    status: 'completed',
                })
                .eq('id', currentSession.id)
                .select()
                .single();

            if (error) throw error;

            set({
                currentSession: data as WorkSession,
                workdayStatus: 'completed',
            });
        } catch (err) {
            console.error('[sessionStore] checkOut error:', err);
        } finally {
            set({ isLoading: false });
        }
    },

    startBreak: async (userId: string, breakType: BreakType) => {
        const { currentSession } = get();
        if (!currentSession) return;

        const now = new Date().toISOString();
        set({ isLoading: true });
        try {
            const { data, error } = await supabase
                .from('breaks')
                .insert({
                    session_id: currentSession.id,
                    user_id: userId,
                    break_type: breakType,
                    started_at: now,
                })
                .select()
                .single();

            if (error) throw error;

            set((state) => ({
                breaks: [...state.breaks, data as Break],
                workdayStatus: 'on_break',
            }));
        } catch (err) {
            console.error('[sessionStore] startBreak error:', err);
        } finally {
            set({ isLoading: false });
        }
    },

    endBreak: async () => {
        const now = new Date().toISOString();
        const { breaks } = get();
        const activeBreak = breaks.find((b) => b.ended_at === null);
        if (!activeBreak) return;

        set({ isLoading: true });
        try {
            const startMs = new Date(activeBreak.started_at).getTime();
            const endMs = Date.now();
            const durationMinutes = Math.floor((endMs - startMs) / 60000);

            const { data, error } = await supabase
                .from('breaks')
                .update({
                    ended_at: now,
                    duration_minutes: durationMinutes,
                })
                .eq('id', activeBreak.id)
                .select()
                .single();

            if (error) throw error;

            set((state) => ({
                breaks: state.breaks.map((b) =>
                    b.id === activeBreak.id ? (data as Break) : b
                ),
                workdayStatus: 'active',
            }));
        } catch (err) {
            console.error('[sessionStore] endBreak error:', err);
        } finally {
            set({ isLoading: false });
        }
    },

    getActiveBreak: () => {
        return get().breaks.find((b) => b.ended_at === null) ?? null;
    },
}));
