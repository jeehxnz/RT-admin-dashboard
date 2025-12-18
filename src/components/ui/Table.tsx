import type { ReactNode } from 'react';

interface TableProps {
  children: ReactNode;
}

export function Table({ children }: TableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">{children}</table>
    </div>
  );
}

export function TableHeader({ children }: TableProps) {
  return (
    <thead className="border-b border-[--color-border]">
      {children}
    </thead>
  );
}

export function TableBody({ children }: TableProps) {
  return <tbody className="divide-y divide-[--color-border]">{children}</tbody>;
}

export function TableRow({ children, onClick }: TableProps & { onClick?: () => void }) {
  return (
    <tr 
      className={`hover:bg-[--color-surface-hover]/50 transition-colors ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
      {children}
    </tr>
  );
}

interface TableCellProps {
  children: ReactNode;
  className?: string;
  isHeader?: boolean;
}

export function TableCell({ children, className = '', isHeader = false }: TableCellProps) {
  const baseClasses = `px-4 py-3 text-sm ${className}`;
  
  if (isHeader) {
    return (
      <th className={`${baseClasses} text-left font-medium text-[--color-text-muted] bg-[--color-background]/50`}>
        {children}
      </th>
    );
  }
  
  return (
    <td className={`${baseClasses} text-[--color-text]`}>
      {children}
    </td>
  );
}

