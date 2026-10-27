import { cx } from '@/lib/utils';

/**
 * Accessible form field. Label is always visible; errors are linked via
 * aria-describedby and announced.
 */
export default function Field({
  label,
  name,
  id,
  as = 'input',
  type = 'text',
  required,
  error,
  hint,
  options,
  placeholder,
  className,
  children,
  optionalLabel = true,
  ...props
}) {
  const fieldId = id || `f-${name}`;
  const hintId = hint ? `${fieldId}-hint` : undefined;
  const errId = error ? `${fieldId}-error` : undefined;
  const describedBy = [hintId, errId].filter(Boolean).join(' ') || undefined;
  const common = {
    id: fieldId,
    name,
    required,
    'aria-invalid': error ? true : undefined,
    'aria-describedby': describedBy,
    placeholder,
    className: 'field__control',
    ...props,
  };

  let control;
  if (as === 'textarea') control = <textarea rows={5} {...common} />;
  else if (as === 'select')
    control = (
      <div className="field__select">
        <select {...common}>
          {placeholder !== undefined && <option value="">{placeholder || 'Select…'}</option>}
          {(options || []).map((o) =>
            typeof o === 'string' ? (
              <option key={o} value={o}>
                {o}
              </option>
            ) : (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            )
          )}
        </select>
      </div>
    );
  else control = <input type={type} {...common} />;

  return (
    <div className={cx('field', error && 'field--error', className)}>
      <label htmlFor={fieldId} className="field__label">
        {label}
        {required ? (
          <span className="field__req" aria-hidden="true">
            *
          </span>
        ) : (
          optionalLabel && <span className="field__opt">Optional</span>
        )}
      </label>
      {control}
      {children}
      {hint && !error && (
        <p id={hintId} className="field__hint">
          {hint}
        </p>
      )}
      {error && (
        <p id={errId} className="field__error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
