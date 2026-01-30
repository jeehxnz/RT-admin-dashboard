import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  children: ReactNode;
}

const variants = {
  primary: 'bg-[--color-accent] hover:bg-[--color-accent-hover] text-white font-semibold border border-[--color-accent] hover:border-[--color-accent-hover] shadow-sm',
  secondary: 'bg-[--color-surface] hover:bg-[--color-surface-hover] text-[--color-text] font-medium border-2 border-[--color-border] shadow-sm',
  danger: 'bg-[--color-danger] hover:opacity-90 text-white font-semibold border border-[--color-danger] shadow-sm',
  ghost: 'hover:bg-[--color-surface-hover] text-[--color-text] font-medium border border-transparent hover:border-[--color-border]',
};

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
};

export function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  children,
  disabled,
  className = '',
  ...props
}: ButtonProps) {
  return (
    <button
      className={`
        inline-flex items-center justify-center gap-2 rounded-lg
        transition-colors duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <Loader2 size={16} className="animate-spin" />}
      {children}
    </button>
  );
}

