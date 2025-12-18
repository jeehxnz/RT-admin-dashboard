import { Loader2 } from 'lucide-react';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizes = {
  sm: 16,
  md: 24,
  lg: 32,
};

export function Spinner({ size = 'md', className = '' }: SpinnerProps) {
  return (
    <Loader2 
      size={sizes[size]} 
      className={`animate-spin text-[--color-accent] ${className}`} 
    />
  );
}

export function FullPageSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[--color-background]">
      <div className="flex flex-col items-center gap-4">
        <Spinner size="lg" />
        <p className="text-[--color-text-muted]">Loading...</p>
      </div>
    </div>
  );
}

