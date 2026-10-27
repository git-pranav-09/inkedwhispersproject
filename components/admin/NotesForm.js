'use client';

import { Save } from 'lucide-react';
import ActionForm from './ActionForm';
import { saveApplicationNotes } from '@/lib/actions/applications';

export default function NotesForm({ id, notes }) {
  return (
    <ActionForm action={saveApplicationNotes} fields={{ id }} className="a-form">
      {({ pending }) => (
        <>
          <label htmlFor="admin_notes" className="visually-hidden">
            Internal notes
          </label>
          <textarea id="admin_notes" name="admin_notes" rows={5} maxLength={4000} defaultValue={notes} className="a-input" placeholder="Visible only to administrators." />
          <button type="submit" className="abtn abtn--ghost abtn--sm" disabled={pending}>
            {pending ? <span className="spinner" aria-hidden="true" /> : <Save size={14} aria-hidden="true" />} Save notes
          </button>
        </>
      )}
    </ActionForm>
  );
}
