import { forwardRef } from 'react';
import type { SelectHTMLAttributes } from 'react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, className = '', ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && (
          <label className="block text-sm font-medium text-[--color-text-muted]">
            {label}
          </label>
        )}
        <select
          ref={ref}
          className={`
            w-full px-4 py-2.5 rounded-lg
            bg-[--color-background] border border-[--color-border]
            text-[--color-text]
            focus:outline-none focus:ring-2 focus:ring-[--color-accent]/50 focus:border-[--color-accent]
            transition-colors duration-200
            text-sm cursor-pointer
            ${error ? 'border-[--color-danger] focus:ring-[--color-danger]/50' : ''}
            ${className}
          `}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && (
          <p className="text-sm text-[--color-danger]">{error}</p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';

