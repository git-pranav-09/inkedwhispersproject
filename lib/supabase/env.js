// Public Supabase configuration. These two values are safe to expose to the
// browser — Row Level Security protects every table.
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

export const REMEMBER_COOKIE = 'iw-remember';
