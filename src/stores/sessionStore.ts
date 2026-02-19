// ─── Session Store (Zustand) ────────────────────────────────────
// Manages workday state: current session, breaks, timer.
// Pure state — no UI knowledge, no data-layer coupling.

import { create } from 'zustand';
import { WorkSession, Break, WorkdayStatus, BreakType } from '@/lib/types';
import { generateId } from '@/lib/utils';
import { MOCK_SESSIONS, MOCK_BREAKS } from '@/lib/mock-data';

interface SessionState {
    currentSession: WorkSession | null;
    breaks: Break[];
    workdayStatus: WorkdayStatus;

    checkIn: () => void;
    checkOut: () => void;
    startBreak: (breakType: BreakType) => void;
    endBreak: () => void;
    getActiveBreak: () => Break | null;
    getCompletedSessions: () => WorkSession[];
}

export const useSessionStore = create<SessionState>((set, get) => {
    // Initialize from mock data
    const activeSession = MOCK_SESSIONS.find(
        (s) => s.user_id === 'u-001' && s.status === 'active'
    ) ?? null;

    const sessionBreaks = activeSession
        ? MOCK_BREAKS.filter((b) => b.session_id === activeSession.id)
        : [];

    const hasActiveBreak = sessionBreaks.some((b) => b.ended_at === null);

    let initialStatus: WorkdayStatus = 'idle';
    if (activeSession) {
        initialStatus = hasActiveBreak ? 'on_break' : 'active';
    }

    return {
        currentSession: activeSession,
        breaks: sessionBreaks,
        workdayStatus: initialStatus,

        checkIn: () => {
            const now = new Date().toISOString();
            const newSession: WorkSession = {
                id: generateId(),
                user_id: 'u-001',
                check_in: now,
                check_out: null,
                net_minutes: null,
                pause_minutes: 0,
                notes: null,
                status: 'active',
                created_at: now,
            };
            set({ currentSession: newSession, breaks: [], workdayStatus: 'active' });
        },

        checkOut: () => {
            const { currentSession, breaks } = get();
            if (!currentSession) return;

            const now = new Date().toISOString();
            const checkInMs = new Date(currentSession.check_in).getTime();
            const checkOutMs = Date.now();
            const totalMinutes = Math.floor((checkOutMs - checkInMs) / 60000);

            const totalPauseMinutes = breaks.reduce((acc, b) => {
                if (b.ended_at) {
                    return acc + (b.duration_minutes ?? 0);
                }
                return acc;
            }, 0);

            const updatedSession: WorkSession = {
                ...currentSession,
                check_out: now,
                net_minutes: totalMinutes - totalPauseMinutes,
                pause_minutes: totalPauseMinutes,
                status: 'completed',
            };

            set({
                currentSession: updatedSession,
                workdayStatus: 'completed',
            });
        },

        startBreak: (breakType: BreakType) => {
            const { currentSession } = get();
            if (!currentSession) return;

            const now = new Date().toISOString();
            const newBreak: Break = {
                id: generateId(),
                session_id: currentSession.id,
                user_id: 'u-001',
                break_type: breakType,
                started_at: now,
                ended_at: null,
                duration_minutes: null,
                notes: null,
            };

            set((state) => ({
                breaks: [...state.breaks, newBreak],
                workdayStatus: 'on_break',
            }));
        },

        endBreak: () => {
            const now = new Date().toISOString();

            set((state) => {
                const updatedBreaks = state.breaks.map((b) => {
                    if (b.ended_at !== null) return b;

                    const startMs = new Date(b.started_at).getTime();
                    const endMs = new Date(now).getTime();
                    const durationMinutes = Math.floor((endMs - startMs) / 60000);

                    return { ...b, ended_at: now, duration_minutes: durationMinutes };
                });

                return { breaks: updatedBreaks, workdayStatus: 'active' };
            });
        },

        getActiveBreak: () => {
            return get().breaks.find((b) => b.ended_at === null) ?? null;
        },

        getCompletedSessions: () => {
            return MOCK_SESSIONS.filter(
                (s) => s.user_id === 'u-001' && s.status === 'completed'
            );
        },
    };
});
