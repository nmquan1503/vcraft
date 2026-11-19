interface Props extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  hint?: string;
}

export default function AuthTextarea({
  label, error, hint, id, className = '', ...rest
}: Props) {
  return (
    <div>
      <label htmlFor={id} className="block text-[10px] uppercase tracking-[0.25em] text-[#1f1b18]/50 mb-2">
        {label}
      </label>
      <textarea
        id={id}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        className={`w-full bg-transparent border-b py-2 text-base text-[#1f1b18] placeholder:text-[#1f1b18]/25 focus:outline-none transition-colors resize-none ${
          error
            ? 'border-red-500 focus:border-red-600'
            : 'border-[#1f1b18]/20 focus:border-[#b45f3c]'
        } ${className}`}
        {...rest}
      />
      {error && <p id={`${id}-error`} role="alert" className="mt-1.5 text-sm text-red-600">{error}</p>}
      {!error && hint && <p id={`${id}-hint`} className="mt-1.5 text-xs text-[#1f1b18]/45">{hint}</p>}
    </div>
  );
}