import type { ChangeEvent, ReactNode } from 'react';

interface FieldProps {
  id: string;
  label: string;
  hint?: string;
  children: ReactNode;
}

export function Field({ id, label, hint, children }: FieldProps) {
  return (
    <div className="field">
      <label className="field-label" htmlFor={id}>
        {label}
      </label>
      {children}
      {hint ? <p className="field-hint">{hint}</p> : null}
    </div>
  );
}

interface TextFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  type?: 'text' | 'email' | 'url' | 'month';
  placeholder?: string;
  hint?: string;
}

export function TextField({
  id,
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
  hint,
}: TextFieldProps) {
  return (
    <Field id={id} label={label} hint={hint}>
      <input
        className="text-input"
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
    </Field>
  );
}

interface TextAreaFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLTextAreaElement>) => void;
  rows?: number;
  hint?: string;
}

export function TextAreaField({
  id,
  label,
  value,
  onChange,
  rows = 4,
  hint,
}: TextAreaFieldProps) {
  return (
    <Field id={id} label={label} hint={hint}>
      <textarea className="text-input text-area" id={id} rows={rows} value={value} onChange={onChange} />
    </Field>
  );
}

interface SelectFieldProps {
  id: string;
  label: string;
  value: string;
  options: Array<{ value: string; label: string }>;
  onChange: (event: ChangeEvent<HTMLSelectElement>) => void;
}

export function SelectField({ id, label, value, options, onChange }: SelectFieldProps) {
  return (
    <Field id={id} label={label}>
      <select className="text-input select-input" id={id} value={value} onChange={onChange}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </Field>
  );
}
