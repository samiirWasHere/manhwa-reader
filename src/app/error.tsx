'use client';

import { useEffect } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import Link from 'next/link';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error('Application error:', error);
    }, [error]);

    return (
        <div className="min-h-[60vh] flex items-center justify-center px-4">
            <div className="text-center max-w-md">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-500/20 mb-6">
                    <AlertTriangle className="w-8 h-8 text-red-400" />
                </div>
                <h1 className="text-2xl font-bold text-white mb-3">
                    Something went wrong!
                </h1>
                <p className="text-text-secondary mb-6">
                    We encountered an unexpected error. Please try again or return to the home page.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <button
                        onClick={reset}
                        className="btn-primary flex items-center justify-center gap-2"
                    >
                        <RefreshCw className="w-4 h-4" />
                        Try Again
                    </button>
                    <Link
                        href="/"
                        className="btn-secondary flex items-center justify-center gap-2"
                    >
                        <Home className="w-4 h-4" />
                        Go Home
                    </Link>
                </div>
                {error.digest && (
                    <p className="mt-6 text-xs text-text-muted">
                        Error ID: {error.digest}
                    </p>
                )}
            </div>
        </div>
    );
}
