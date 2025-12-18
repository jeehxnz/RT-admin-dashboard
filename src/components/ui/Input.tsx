import { forwardRef } from 'react';
import type { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && (
          <label className="block text-sm font-medium text-[--color-text-muted]">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`
            w-full px-4 py-2.5 rounded-lg
            bg-[--color-background] border border-[--color-border]
            text-[--color-text] placeholder:text-[--color-text-muted]/50
            focus:outline-none focus:ring-2 focus:ring-[--color-accent]/50 focus:border-[--color-accent]
            transition-colors duration-200
            font-[family-name:var(--font-mono)] text-sm
            ${error ? 'border-[--color-danger] focus:ring-[--color-danger]/50' : ''}
            ${className}
          `}
          {...props}
        />
        {error && (
          <p className="text-sm text-[--color-danger]">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

