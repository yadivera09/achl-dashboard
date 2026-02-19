// ─── Supabase Client Wrapper ────────────────────────────────────
// Singleton browser client. All consumers import from here.
// Dependency agnosticism: only this file imports from @supabase/supabase-js.

import { createClient, SupabaseClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

let clientInstance: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient {
    if (!clientInstance) {
        clientInstance = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
            auth: {
                persistSession: true,
                autoRefreshToken: true,
                detectSessionInUrl: true,
            },
        });
    }
    return clientInstance;
}

// Convenience alias
export const supabase = getSupabaseClient();
