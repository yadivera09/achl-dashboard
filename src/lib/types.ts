// ─── Domain Types ───────────────────────────────────────────────
// Centralized type definitions matching the Supabase schema (SRS §5.1)

export type UserRole = 'employee' | 'supervisor' | 'admin';

export type WorkSessionStatus = 'active' | 'completed' | 'edited';

export type BreakType = 'rest' | 'lunch' | 'medical' | 'other';

export type AuditAction = 'insert' | 'update' | 'delete';

// ─── Entities ───────────────────────────────────────────────────

export interface Profile {
    id: string;
    full_name: string;
    avatar_url: string | null;
    role: UserRole;
    timezone: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface WorkSession {
    id: string;
    user_id: string;
    check_in: string;
    check_out: string | null;
    net_minutes: number | null;
    pause_minutes: number;
    notes: string | null;
    status: WorkSessionStatus;
    created_at: string;
}

export interface Break {
    id: string;
    session_id: string;
    user_id: string;
    break_type: BreakType;
    started_at: string;
    ended_at: string | null;
    duration_minutes: number | null;
    notes: string | null;
}

export interface AuditLog {
    id: string;
    editor_id: string;
    target_id: string;
    table_name: string;
    action: AuditAction;
    old_data: Record<string, unknown> | null;
    new_data: Record<string, unknown> | null;
    reason: string;
    created_at: string;
}

// ─── UI State Types ─────────────────────────────────────────────

export type WorkdayStatus = 'idle' | 'active' | 'on_break' | 'completed';

export interface DailySummary {
    date: string;
    dayLabel: string;
    hoursWorked: number;
}

export interface EmployeeStatus {
    profile: Profile;
    currentSession: WorkSession | null;
    currentBreak: Break | null;
    workdayStatus: WorkdayStatus;
}
