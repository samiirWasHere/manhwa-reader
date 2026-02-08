import Link from 'next/link';
import { Home, Search, BookOpen } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="min-h-[70vh] flex items-center justify-center px-4">
            <div className="text-center max-w-md">
                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-purple-600/20 to-pink-600/20 flex items-center justify-center">
                    <BookOpen className="w-12 h-12 text-primary" />
                </div>

                <h1 className="text-6xl font-bold text-white mb-4">404</h1>
                <h2 className="text-xl font-semibold text-white mb-2">Page Not Found</h2>
                <p className="text-text-secondary mb-8">
                    The page you&apos;re looking for doesn&apos;t exist or has been moved.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link
                        href="/"
                        className="btn-primary inline-flex items-center gap-2"
                    >
                        <Home className="w-4 h-4" />
                        Go Home
                    </Link>
                    <Link
                        href="/manhwa"
                        className="btn-secondary inline-flex items-center gap-2"
                    >
                        <Search className="w-4 h-4" />
                        Browse Manhwa
                    </Link>
                </div>
            </div>
        </div>
    );
}
