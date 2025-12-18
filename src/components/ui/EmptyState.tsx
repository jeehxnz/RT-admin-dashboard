import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="w-16 h-16 rounded-full bg-[--color-surface-hover] flex items-center justify-center mb-4">
        <Icon size={32} className="text-[--color-text-muted]" />
      </div>
      <h3 className="text-lg font-medium text-[--color-text] mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-[--color-text-muted] max-w-sm mb-4">{description}</p>
      )}
      {action}
    </div>
  );
}

