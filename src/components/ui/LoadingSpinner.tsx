import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

export default function LoadingSpinner({ size = 'md', className }: LoadingSpinnerProps) {
    const sizes = {
        sm: 'w-5 h-5',
        md: 'w-8 h-8',
        lg: 'w-12 h-12',
    };

    return (
        <div className={cn('flex items-center justify-center', className)}>
            <div
                className={cn(
                    'animate-spin rounded-full border-2 border-surface-border border-t-primary',
                    sizes[size]
                )}
            />
        </div>
    );
}

export function PageLoader() {
    return (
        <div className="min-h-[50vh] flex items-center justify-center">
            <div className="text-center">
                <LoadingSpinner size="lg" className="mb-4" />
                <p className="text-text-muted">Loading...</p>
            </div>
        </div>
    );
}

export function CardSkeleton() {
    return (
        <div className="animate-pulse">
            <div className="aspect-[3/4] rounded-xl bg-surface-border mb-3" />
            <div className="h-4 bg-surface-border rounded w-3/4 mb-2" />
            <div className="h-3 bg-surface-border rounded w-1/2" />
        </div>
    );
}

export function CardGridSkeleton({ count = 10 }: { count?: number }) {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {Array.from({ length: count }).map((_, i) => (
                <CardSkeleton key={i} />
            ))}
        </div>
    );
}
