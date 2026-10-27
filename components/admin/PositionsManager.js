'use client';

import { useActionState, useState } from 'react';
import { Pencil, Plus, Save } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import Field from '@/components/ui/Field';
import ConfirmAction from './ConfirmAction';
import EmptyState from '@/components/ui/EmptyState';
import { savePosition, deletePosition } from '@/lib/actions/positions';
import { AVAILABILITY } from '@/lib/constants';

function PositionForm({ position, departments, onDone }) {
  const [state, action, pending] = useActionState(async (prev, fd) => {
    const res = await savePosition(prev, fd);
    if (res?.ok) onDone();
    return res;
  }, null);
  const e = state?.errors || {};
  return (
    <form action={action} className="a-form" noValidate>
      {position?.id && <input type="hidden" name="id" value={position.id} />}
      {state && !state.ok && state.message && (
        <div className="a-alert" role="alert">
          {state.message}
        </div>
      )}
      <div className="a-form__row">
        <Field label="Position name" name="title" required maxLength={120} defaultValue={position?.title || ''} error={e.title} />
        <Field label="Department" name="department" required maxLength={120} defaultValue={position?.department || ''} list="department-list" error={e.department} />
        <datalist id="department-list">
          {departments.map((d) => (
            <option key={d} value={d} />
          ))}
        </datalist>
      </div>
      <Field label="Description" name="description" as="textarea" rows={3} maxLength={2000} defaultValue={position?.description || ''} error={e.description} />
      <Field label="Responsibilities" name="responsibilities" as="textarea" rows={4} maxLength={4000} defaultValue={position?.responsibilities || ''} hint="One per line." error={e.responsibilities} />
      <Field label="Requirements" name="requirements" as="textarea" rows={3} maxLength={4000} defaultValue={position?.requirements || ''} hint="One per line." error={e.requirements} />
      <div className="a-form__row a-form__row--3">
        <Field label="Availability" name="availability" as="select" required options={AVAILABILITY} defaultValue={position?.availability || 'Open'} error={e.availability} />
        <Field label="Commitment" name="commitment" maxLength={120} defaultValue={position?.commitment || ''} placeholder="e.g. 4–6 hrs / week" error={e.commitment} />
        <Field label="Display order" name="sort_order" type="number" min={0} max={9999} defaultValue={position?.sort_order ?? 0} error={e.sort_order} />
      </div>
      <label className="a-check">
        <input type="checkbox" name="is_active" defaultChecked={position ? position.is_active : true} />
        <span>
          <strong>Show on the Join Us page</strong>
          <small>Hidden positions cannot receive applications.</small>
        </span>
      </label>
      <div className="confirm__actions">
        <button type="button" className="abtn abtn--ghost" onClick={onDone} disabled={pending}>
          Cancel
        </button>
        <button type="submit" className="abtn abtn--primary" disabled={pending} aria-busy={pending}>
          {pending ? <span className="spinner" aria-hidden="true" /> : <Save size={15} aria-hidden="true" />} {position?.id ? 'Save position' : 'Create position'}
        </button>
      </div>
    </form>
  );
}

export default function PositionsManager({ positions }) {
  const [editing, setEditing] = useState(null); // null | {} | position
  const departments = [...new Set(positions.map((p) => p.department))].sort();
  const grouped = departments.map((d) => ({ department: d, items: positions.filter((p) => p.department === d) }));

  return (
    <>
      <div className="a-toolbar">
        <button type="button" className="abtn abtn--primary" onClick={() => setEditing({})}>
          <Plus size={16} aria-hidden="true" /> New Position
        </button>
      </div>

      {positions.length === 0 ? (
        <EmptyState tone="light" title="No positions yet." message="Create positions to open applications on the Join Us page. The seed file adds a starter set." />
      ) : (
        grouped.map((g) => (
          <section key={g.department} className="a-card a-card--flush pos-group">
            <h2 className="pos-group__title">{g.department}</h2>
            <ul role="list" className="pos-list">
              {g.items.map((p) => (
                <li key={p.id} className="pos-list__item">
                  <div className="pos-list__main">
                    <strong>{p.title}</strong>
                    <span>
                      {p.commitment || 'Commitment not set'} · Order {p.sort_order}
                    </span>
                  </div>
                  <span className={`tag tag--${p.availability.toLowerCase()}`}>{p.availability}</span>
                  <span className={`tag${p.is_active ? ' tag--on' : ''}`}>{p.is_active ? 'Visible' : 'Hidden'}</span>
                  <div className="row-actions">
                    <button type="button" className="icon-btn" onClick={() => setEditing(p)} aria-label={`Edit ${p.title}`}>
                      <Pencil size={15} />
                    </button>
                    <ConfirmAction action={deletePosition} fields={{ id: p.id }} iconOnly triggerLabel={`Delete ${p.title}`} title="Delete this position?" description="Existing applications keep the position name, but new applicants will no longer see it." confirmLabel="Delete position" />
                  </div>
                </li>
              ))}
            </ul>
          </section>
        ))
      )}

      <Modal open={editing !== null} onClose={() => setEditing(null)} title={editing?.id ? 'Edit position' : 'New position'} size="lg">
        {editing !== null && <PositionForm key={editing.id || 'new'} position={editing.id ? editing : null} departments={departments} onDone={() => setEditing(null)} />}
      </Modal>
    </>
  );
}
