import type { ReactNode } from 'react';

interface BadgeProps {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  children: ReactNode;
}

const variants = {
  default: 'bg-[--color-surface-hover] text-[--color-text-muted]',
  success: 'bg-[--color-success]/10 text-[--color-success]',
  warning: 'bg-[--color-warning]/10 text-[--color-warning]',
  danger: 'bg-[--color-danger]/10 text-[--color-danger]',
  info: 'bg-[--color-accent]/10 text-[--color-accent]',
};

export function Badge({ variant = 'default', children }: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center px-2.5 py-0.5 rounded-full
        text-xs font-medium
        ${variants[variant]}
      `}
    >
      {children}
    </span>
  );
}

