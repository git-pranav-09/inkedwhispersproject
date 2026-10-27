'use client';

import { RotateCcw } from 'lucide-react';
import EmptyState from '@/components/ui/EmptyState';

export default function AdminError({ error, reset }) {
  return (
    <EmptyState
      tone="light"
      title="This section could not be loaded."
      message={`An unexpected error occurred${error?.digest ? ` (ref ${error.digest})` : ''}. Check your connection and try again.`}
      action={
        <button type="button" className="abtn abtn--primary" onClick={() => reset()}>
          <RotateCcw size={15} aria-hidden="true" /> Try again
        </button>
      }
    />
  );
}
