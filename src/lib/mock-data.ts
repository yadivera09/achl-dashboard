// ─── Mock Data ──────────────────────────────────────────────────
// Realistic demo data for local development without Supabase.
// This file is the single source of truth for all mock state.

import { Profile, WorkSession, Break, DailySummary, EmployeeStatus } from './types';

// ─── Current User ───────────────────────────────────────────────

export const MOCK_CURRENT_USER: Profile = {
    id: 'u-001',
    full_name: 'Carlos Mendoza',
    avatar_url: null,
    role: 'admin',
    timezone: 'America/Bogota',
    is_active: true,
    created_at: '2025-06-01T08:00:00Z',
    updated_at: '2026-02-19T08:00:00Z',
};

// ─── Employees ──────────────────────────────────────────────────

export const MOCK_EMPLOYEES: Profile[] = [
    MOCK_CURRENT_USER,
    {
        id: 'u-002',
        full_name: 'Sofía Herrera',
        avatar_url: null,
        role: 'employee',
        timezone: 'America/Bogota',
        is_active: true,
        created_at: '2025-07-15T08:00:00Z',
        updated_at: '2026-02-10T08:00:00Z',
    },
    {
        id: 'u-003',
        full_name: 'Andrés Vargas',
        avatar_url: null,
        role: 'employee',
        timezone: 'America/Bogota',
        is_active: true,
        created_at: '2025-08-20T08:00:00Z',
        updated_at: '2026-02-12T08:00:00Z',
    },
    {
        id: 'u-004',
        full_name: 'Laura Jiménez',
        avatar_url: null,
        role: 'supervisor',
        timezone: 'America/Bogota',
        is_active: true,
        created_at: '2025-09-01T08:00:00Z',
        updated_at: '2026-02-18T08:00:00Z',
    },
    {
        id: 'u-005',
        full_name: 'Miguel Torres',
        avatar_url: null,
        role: 'employee',
        timezone: 'America/Bogota',
        is_active: true,
        created_at: '2025-09-15T08:00:00Z',
        updated_at: '2026-02-17T08:00:00Z',
    },
    {
        id: 'u-006',
        full_name: 'Isabella Restrepo',
        avatar_url: null,
        role: 'employee',
        timezone: 'America/Bogota',
        is_active: false,
        created_at: '2025-10-01T08:00:00Z',
        updated_at: '2026-01-15T08:00:00Z',
    },
];

// ─── Work Sessions (historical) ─────────────────────────────────

const today = new Date();
const todayISO = today.toISOString().split('T')[0];

function dayOffset(days: number): string {
    const d = new Date(today);
    d.setDate(d.getDate() - days);
    return d.toISOString().split('T')[0];
}

export const MOCK_SESSIONS: WorkSession[] = [
    // Today — active session for current user
    {
        id: 'ws-today',
        user_id: 'u-001',
        check_in: `${todayISO}T08:02:00Z`,
        check_out: null,
        net_minutes: null,
        pause_minutes: 15,
        notes: null,
        status: 'active',
        created_at: `${todayISO}T08:02:00Z`,
    },
    // Yesterday
    {
        id: 'ws-y1',
        user_id: 'u-001',
        check_in: `${dayOffset(1)}T08:05:00Z`,
        check_out: `${dayOffset(1)}T17:10:00Z`,
        net_minutes: 510,
        pause_minutes: 35,
        notes: null,
        status: 'completed',
        created_at: `${dayOffset(1)}T08:05:00Z`,
    },
    {
        id: 'ws-y2',
        user_id: 'u-001',
        check_in: `${dayOffset(2)}T07:55:00Z`,
        check_out: `${dayOffset(2)}T16:50:00Z`,
        net_minutes: 495,
        pause_minutes: 40,
        notes: 'Salida anticipada',
        status: 'completed',
        created_at: `${dayOffset(2)}T07:55:00Z`,
    },
    {
        id: 'ws-y3',
        user_id: 'u-001',
        check_in: `${dayOffset(3)}T08:10:00Z`,
        check_out: `${dayOffset(3)}T17:30:00Z`,
        net_minutes: 530,
        pause_minutes: 30,
        notes: null,
        status: 'completed',
        created_at: `${dayOffset(3)}T08:10:00Z`,
    },
    {
        id: 'ws-y4',
        user_id: 'u-001',
        check_in: `${dayOffset(4)}T08:00:00Z`,
        check_out: `${dayOffset(4)}T17:00:00Z`,
        net_minutes: 480,
        pause_minutes: 60,
        notes: null,
        status: 'completed',
        created_at: `${dayOffset(4)}T08:00:00Z`,
    },
    // Employees active today
    {
        id: 'ws-s2',
        user_id: 'u-002',
        check_in: `${todayISO}T07:50:00Z`,
        check_out: null,
        net_minutes: null,
        pause_minutes: 0,
        notes: null,
        status: 'active',
        created_at: `${todayISO}T07:50:00Z`,
    },
    {
        id: 'ws-s3',
        user_id: 'u-003',
        check_in: `${todayISO}T08:15:00Z`,
        check_out: null,
        net_minutes: null,
        pause_minutes: 20,
        notes: null,
        status: 'active',
        created_at: `${todayISO}T08:15:00Z`,
    },
    {
        id: 'ws-s4',
        user_id: 'u-004',
        check_in: `${todayISO}T08:00:00Z`,
        check_out: null,
        net_minutes: null,
        pause_minutes: 0,
        notes: null,
        status: 'active',
        created_at: `${todayISO}T08:00:00Z`,
    },
    {
        id: 'ws-s5',
        user_id: 'u-005',
        check_in: `${todayISO}T09:00:00Z`,
        check_out: null,
        net_minutes: null,
        pause_minutes: 0,
        notes: null,
        status: 'active',
        created_at: `${todayISO}T09:00:00Z`,
    },
];

// ─── Breaks ─────────────────────────────────────────────────────

export const MOCK_BREAKS: Break[] = [
    {
        id: 'b-001',
        session_id: 'ws-today',
        user_id: 'u-001',
        break_type: 'rest',
        started_at: `${todayISO}T10:00:00Z`,
        ended_at: `${todayISO}T10:15:00Z`,
        duration_minutes: 15,
        notes: null,
    },
    // Andrés currently on break
    {
        id: 'b-002',
        session_id: 'ws-s3',
        user_id: 'u-003',
        break_type: 'lunch',
        started_at: `${todayISO}T12:00:00Z`,
        ended_at: null,
        duration_minutes: null,
        notes: 'Almuerzo',
    },
];

// ─── Weekly Daily Summaries ─────────────────────────────────────

export const MOCK_WEEKLY_SUMMARY: DailySummary[] = [
    { date: dayOffset(6), dayLabel: 'Lun', hoursWorked: 8.2 },
    { date: dayOffset(5), dayLabel: 'Mar', hoursWorked: 7.8 },
    { date: dayOffset(4), dayLabel: 'Mié', hoursWorked: 8.0 },
    { date: dayOffset(3), dayLabel: 'Jue', hoursWorked: 8.8 },
    { date: dayOffset(2), dayLabel: 'Vie', hoursWorked: 8.3 },
    { date: dayOffset(1), dayLabel: 'Sáb', hoursWorked: 8.5 },
    { date: todayISO, dayLabel: 'Hoy', hoursWorked: 4.2 },
];

// ─── Employee Statuses (for admin dashboard) ────────────────────

export function getMockEmployeeStatuses(): EmployeeStatus[] {
    return MOCK_EMPLOYEES.filter((e) => e.is_active).map((profile) => {
        const currentSession = MOCK_SESSIONS.find(
            (s) => s.user_id === profile.id && s.status === 'active'
        ) ?? null;

        const currentBreak = currentSession
            ? MOCK_BREAKS.find(
                (b) => b.session_id === currentSession.id && b.ended_at === null
            ) ?? null
            : null;

        let workdayStatus: EmployeeStatus['workdayStatus'] = 'idle';
        if (currentSession) {
            workdayStatus = currentBreak ? 'on_break' : 'active';
        }

        return { profile, currentSession, currentBreak, workdayStatus };
    });
}
