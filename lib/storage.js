import 'server-only';
import { randomUUID } from 'node:crypto';

const IMAGE_TYPES = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/avif': 'avif',
};
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
export const MAX_RESUME_BYTES = 4 * 1024 * 1024;

/** Checks the real file signature, not just the client-reported MIME type. */
function sniff(bytes) {
  const b = bytes;
  if (b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return 'image/jpeg';
  if (b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47) return 'image/png';
  if (b[0] === 0x52 && b[1] === 0x49 && b[2] === 0x46 && b[3] === 0x46 && b[8] === 0x57 && b[9] === 0x45 && b[10] === 0x42 && b[11] === 0x50) return 'image/webp';
  if (b[4] === 0x66 && b[5] === 0x74 && b[6] === 0x79 && b[7] === 0x70 && b[8] === 0x61 && b[9] === 0x76 && b[10] === 0x69) return 'image/avif';
  if (b[0] === 0x25 && b[1] === 0x50 && b[2] === 0x44 && b[3] === 0x46) return 'application/pdf';
  return null;
}

export function hasFile(file) {
  return file && typeof file === 'object' && typeof file.arrayBuffer === 'function' && file.size > 0;
}

/** Validates an uploaded image. Returns { ok, error, bytes, type, ext }. */
export async function inspectImage(file) {
  if (!hasFile(file)) return { ok: false, error: 'No file provided.' };
  if (file.size > MAX_IMAGE_BYTES) return { ok: false, error: 'Images must be 5 MB or smaller.' };
  const bytes = new Uint8Array(await file.arrayBuffer());
  const type = sniff(bytes);
  if (!type || !IMAGE_TYPES[type]) return { ok: false, error: 'Only JPG, PNG, WebP or AVIF images are accepted.' };
  return { ok: true, bytes, type, ext: IMAGE_TYPES[type] };
}

export async function inspectResume(file) {
  if (!hasFile(file)) return { ok: false, error: 'No file provided.' };
  if (file.size > MAX_RESUME_BYTES) return { ok: false, error: 'Résumé must be a PDF of 4 MB or less.' };
  const bytes = new Uint8Array(await file.arrayBuffer());
  if (sniff(bytes) !== 'application/pdf') return { ok: false, error: 'Résumé must be a PDF file.' };
  return { ok: true, bytes, type: 'application/pdf', ext: 'pdf' };
}

/** Random, non-guessable object name inside a folder. User filenames are never used. */
export function objectPath(folder, ext) {
  const d = new Date();
  return `${folder}/${d.getUTCFullYear()}/${String(d.getUTCMonth() + 1).padStart(2, '0')}/${randomUUID()}.${ext}`;
}

/**
 * Uploads an image to the public `media` bucket with the admin's own client
 * (storage RLS requires is_admin()). Returns { url, path } or { error }.
 */
export async function uploadMedia(supabase, file, folder) {
  const info = await inspectImage(file);
  if (!info.ok) return { error: info.error };
  const path = objectPath(folder, info.ext);
  const { error } = await supabase.storage.from('media').upload(path, info.bytes, {
    contentType: info.type,
    cacheControl: '31536000',
    upsert: false,
  });
  if (error) return { error: 'The image could not be uploaded. Please try again.' };
  const { data } = supabase.storage.from('media').getPublicUrl(path);
  return { url: data.publicUrl, path };
}

/** Extracts the storage path from a public media URL so it can be deleted. */
export function mediaPathFromUrl(url) {
  if (!url) return null;
  const marker = '/storage/v1/object/public/media/';
  const i = url.indexOf(marker);
  return i === -1 ? null : decodeURIComponent(url.slice(i + marker.length));
}
