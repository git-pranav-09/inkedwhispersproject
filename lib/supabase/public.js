import 'server-only';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_ANON_KEY, isSupabaseConfigured } from './env';

let client = null;

/**
 * Cookie-less anonymous client for reading PUBLIC content (published events,
 * active core members, site copy). Because it never touches cookies, pages
 * that use it can be statically rendered and revalidated.
 */
export function createPublicClient() {
  if (!isSupabaseConfigured) return null;
  if (!client) {
    client = createSupabaseClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return client;
}
