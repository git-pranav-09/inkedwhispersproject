import 'server-only';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_URL } from './env';

/**
 * Service-role client. BYPASSES Row Level Security.
 *
 * The `server-only` import above makes the build fail if this module is ever
 * imported into a Client Component, so the key can never reach the browser.
 * Use it only for: public form submissions (after validation + rate limiting)
 * and rate-limit bookkeeping. All admin CRUD uses the user-scoped client so
 * RLS is still enforced.
 */
export function createServiceClient() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!SUPABASE_URL || !key) return null;
  return createSupabaseClient(SUPABASE_URL, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
