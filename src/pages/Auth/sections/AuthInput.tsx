import { useState } from 'react';

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
}

export default function AuthInput({
  label, error, hint, id, type = 'text', className = '', ...rest
}: Props) {
  const [showPwd, setShowPwd] = useState(false);
  const isPassword = type === 'password';
  const actualType = isPassword && showPwd ? 'text' : type;

  return (
    <div className={`auth-field ${error ? 'auth-field--error' : ''}`}>
      <input
        id={id}
        type={actualType}
        placeholder=" "
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        className={`auth-field__input ${className}`}
        {...rest}
      />
      <label htmlFor={id} className="auth-field__label">{label}</label>

      {isPassword && (
        <button
          type="button"
          onClick={() => setShowPwd((v) => !v)}
          aria-label={showPwd ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
          className="auth-field__toggle"
        >
          {showPwd ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M3 3l18 18M10.6 10.6a2 2 0 002.8 2.8M9.9 5.1A10.5 10.5 0 0121 12c-.8 1.3-1.9 2.5-3.2 3.4M6.2 6.2A10.5 10.5 0 003 12c3 5 9 7 18 0" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          )}
        </button>
      )}

      {error && <p id={`${id}-error`} role="alert" className="mt-1.5 text-sm text-red-600">{error}</p>}
      {!error && hint && <p id={`${id}-hint`} className="mt-1.5 text-xs text-[#1f1b18]/45">{hint}</p>}
    </div>
  );
}