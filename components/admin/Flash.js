'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { CircleCheck, X } from 'lucide-react';

const MESSAGES = {
  saved: 'Changes saved successfully.',
  deleted: 'Item deleted.',
};

/** Shows a one-time confirmation driven by ?saved=1 / ?deleted=1, then cleans the URL. */
export default function Flash() {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const key = Object.keys(MESSAGES).find((k) => params.get(k));
  const [visible, setVisible] = useState(Boolean(key));

  useEffect(() => {
    if (!key) return;
    setVisible(true);
    const next = new URLSearchParams(params.toString());
    Object.keys(MESSAGES).forEach((k) => next.delete(k));
    const qs = next.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    const t = setTimeout(() => setVisible(false), 4000);
    return () => clearTimeout(t);
  }, [key]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!visible || !key) return null;
  return (
    <div className="flash" role="status">
      <CircleCheck size={18} aria-hidden="true" />
      <span>{MESSAGES[key]}</span>
      <button type="button" className="icon-btn" onClick={() => setVisible(false)} aria-label="Dismiss">
        <X size={15} />
      </button>
    </div>
  );
}
