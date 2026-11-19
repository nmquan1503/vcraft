interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export default function AuthInput({ label, error, id, ...rest }: Props) {
  return (
    <div>
      <label htmlFor={id} className="block text-[10px] uppercase tracking-[0.25em] text-[#1f1b18]/50 mb-2">
        {label}
      </label>
      <input
        id={id}
        {...rest}
        className={`w-full bg-transparent border-b py-2 text-sm text-[#1f1b18] placeholder:text-[#1f1b18]/25 focus:outline-none transition-colors ${
          error
            ? 'border-red-500 focus:border-red-600'
            : 'border-[#1f1b18]/20 focus:border-[#b45f3c]'
        }`}
      />
      {error && <p className="mt-1.5 text-xs text-red-600">{error}</p>}
    </div>
  );
}