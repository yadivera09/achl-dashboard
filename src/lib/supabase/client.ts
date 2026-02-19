// ─── Supabase Client Wrapper ────────────────────────────────────
// Wraps @supabase/supabase-js behind a factory function.
// Consumers import from this file only — never directly from the SDK.
// This ensures dependency agnosticism (SRS §7.1, user rule I).

import { createClient, SupabaseClient } from '@supabase/supabase-js';

let clientInstance: SupabaseClient | null = null;

/**
 * Returns a singleton Supabase browser client.
 * Falls back gracefully if env vars are not configured yet.
 */
export function getSupabaseClient(): SupabaseClient | null {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!url || !anonKey || url.includes('your-project')) {
        // Supabase not configured — app will run with mock data
        return null;
    }

    if (!clientInstance) {
        clientInstance = createClient(url, anonKey);
    }

    return clientInstance;
}

/**
 * Returns true when Supabase is properly configured.
 */
export function isSupabaseConfigured(): boolean {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
    return !url.includes('your-project') && url.startsWith('https://');
}
