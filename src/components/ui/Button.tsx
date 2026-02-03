import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  children: ReactNode;
}

const variants = {
  primary:
    'bg-[--color-accent] hover:bg-[--color-accent-hover] text-white font-semibold border-2 border-[--color-accent] hover:border-[--color-accent-hover] shadow-sm disabled:bg-[--color-button-secondary-disabled] disabled:text-[--color-text-muted] disabled:border-[--color-border] disabled:hover:bg-[--color-button-secondary-disabled]',
  secondary:
    'bg-[--color-button-secondary] hover:bg-[--color-button-secondary-hover] text-[--color-text] font-medium border-2 border-[--color-border] shadow-sm disabled:bg-[--color-button-secondary-disabled] disabled:text-[--color-text-muted] disabled:border-[--color-border] disabled:hover:bg-[--color-button-secondary-disabled]',
  danger:
    'bg-[--color-danger] hover:opacity-90 text-white font-semibold border-2 border-[--color-danger] shadow-sm disabled:bg-[--color-button-secondary-disabled] disabled:text-[--color-text-muted] disabled:border-[--color-border] disabled:hover:opacity-100',
  ghost:
    'hover:bg-[--color-surface-hover] text-[--color-text] font-medium border border-transparent hover:border-[--color-border] disabled:text-[--color-text-muted] disabled:hover:bg-transparent disabled:hover:border-transparent',
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
        disabled:cursor-not-allowed
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

