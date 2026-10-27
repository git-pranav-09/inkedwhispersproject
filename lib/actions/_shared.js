import 'server-only';
import { revalidatePath } from 'next/cache';
import { assertAdmin } from '@/lib/auth';
import { UUID_RE } from '@/lib/validations-admin';

/** Runs an admin action with authorization + uniform error handling. */
export async function adminAction(fn) {
  let ctx;
  try {
    ctx = await assertAdmin();
  } catch {
    return { ok: false, message: 'Your session has expired or you are not authorised. Please sign in again.' };
  }
  try {
    return await fn(ctx);
  } catch (err) {
    // Re-throw Next.js control-flow errors (redirect / notFound).
    if (err && typeof err === 'object' && 'digest' in err && String(err.digest).startsWith('NEXT_')) throw err;
    console.error('[admin action]', err?.message || err);
    return { ok: false, message: 'Something went wrong. Please try again.' };
  }
}

export function getId(formData, key = 'id') {
  const id = String(formData.get(key) || '');
  return UUID_RE.test(id) ? id : null;
}

/** Revalidates every public page that might show changed content. */
export function revalidatePublic() {
  revalidatePath('/', 'layout');
}

export function dbError(error, fallback = 'The change could not be saved.') {
  if (!error) return null;
  if (error.code === '23505') return 'That value is already in use. Please choose another (for example, a different slug).';
  if (error.code === '42501') return 'You do not have permission to make this change.';
  if (error.code === '23514') return 'One of the values is outside the allowed range or length.';
  return fallback;
}
