// ─── Utility functions ──────────────────────────────────────────
// Pure functions for time formatting and calculations.
// No side-effects, no UI awareness.

/**
 * Formats a total number of seconds into HH:MM:SS string.
 */
export function formatDuration(totalSeconds: number): string {
    if (totalSeconds < 0) return '00:00:00';

    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = Math.floor(totalSeconds % 60);

    return [hours, minutes, seconds]
        .map((unit) => String(unit).padStart(2, '0'))
        .join(':');
}

/**
 * Calculates elapsed seconds between two ISO timestamps.
 * If `end` is null, uses `Date.now()` as reference.
 */
export function elapsedSeconds(start: string, end: string | null): number {
    const startMs = new Date(start).getTime();
    const endMs = end ? new Date(end).getTime() : Date.now();
    return Math.max(0, Math.floor((endMs - startMs) / 1000));
}

/**
 * Formats an ISO date string to a short localized time (e.g., "09:15").
 */
export function formatTime(isoString: string): string {
    return new Date(isoString).toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit',
    });
}

/**
 * Formats an ISO date string to a short localized date (e.g., "19 Feb").
 */
export function formatDate(isoString: string): string {
    return new Date(isoString).toLocaleDateString('es-ES', {
        day: '2-digit',
        month: 'short',
    });
}

/**
 * Formats an ISO date string to full date (e.g., "19 de febrero de 2026").
 */
export function formatFullDate(isoString: string): string {
    return new Date(isoString).toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });
}

/**
 * Returns the label for a break type in Spanish.
 */
export function breakTypeLabel(type: string): string {
    const labels: Record<string, string> = {
        rest: 'Descanso',
        lunch: 'Almuerzo',
        medical: 'Médico',
        other: 'Otro',
    };
    return labels[type] ?? type;
}

/**
 * Generates a pseudo-random UUID v4 for client-side ID generation.
 */
export function generateId(): string {
    return crypto.randomUUID();
}

/**
 * Returns the short day-of-week label for a date.
 */
export function dayOfWeekShort(isoString: string): string {
    return new Date(isoString).toLocaleDateString('es-ES', { weekday: 'short' });
}

/**
 * Clamps a number between min and max.
 */
export function clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
}
