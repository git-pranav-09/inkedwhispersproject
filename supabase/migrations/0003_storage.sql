-- ═══════════════════════════════════════════════════════════════════════
-- Inked Whispers — Storage buckets & policies
--   media   : PUBLIC read. Event images, gallery photos, core member photos.
--             Only administrators may upload / replace / delete.
--   resumes : PRIVATE. Applicant résumés (PDF). Written by the server with
--             the service role; readable by administrators via signed URLs.
-- ═══════════════════════════════════════════════════════════════════════

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('media', 'media', true, 5242880, array['image/jpeg', 'image/png', 'image/webp', 'image/avif']),
  ('resumes', 'resumes', false, 4194304, array['application/pdf'])
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

-- media: public read
drop policy if exists "media: public read" on storage.objects;
create policy "media: public read" on storage.objects
  for select to anon, authenticated
  using (bucket_id = 'media');

-- media: admin write
drop policy if exists "media: admin insert" on storage.objects;
create policy "media: admin insert" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'media' and public.is_admin());

drop policy if exists "media: admin update" on storage.objects;
create policy "media: admin update" on storage.objects
  for update to authenticated
  using (bucket_id = 'media' and public.is_admin())
  with check (bucket_id = 'media' and public.is_admin());

drop policy if exists "media: admin delete" on storage.objects;
create policy "media: admin delete" on storage.objects
  for delete to authenticated
  using (bucket_id = 'media' and public.is_admin());

-- resumes: admin read only (uploads happen server-side with the service role)
drop policy if exists "resumes: admin read" on storage.objects;
create policy "resumes: admin read" on storage.objects
  for select to authenticated
  using (bucket_id = 'resumes' and public.is_admin());

drop policy if exists "resumes: admin delete" on storage.objects;
create policy "resumes: admin delete" on storage.objects
  for delete to authenticated
  using (bucket_id = 'resumes' and public.is_admin());
