'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Bookmark, BookmarkCheck, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BookmarkButtonProps {
    manhwaId: string;
    initialBookmarked?: boolean;
    variant?: 'default' | 'icon';
    className?: string;
}

export default function BookmarkButton({
    manhwaId,
    initialBookmarked = false,
    variant = 'default',
    className,
}: BookmarkButtonProps) {
    const { data: session } = useSession();
    const router = useRouter();
    const [isBookmarked, setIsBookmarked] = useState(initialBookmarked);
    const [isLoading, setIsLoading] = useState(false);

    const handleBookmark = async () => {
        if (!session) {
            router.push('/auth/login');
            return;
        }

        setIsLoading(true);
        try {
            const res = await fetch('/api/bookmarks', {
                method: isBookmarked ? 'DELETE' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ manhwaId }),
            });

            if (res.ok) {
                setIsBookmarked(!isBookmarked);
            }
        } catch (error) {
            console.error('Bookmark error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (variant === 'icon') {
        return (
            <button
                onClick={handleBookmark}
                disabled={isLoading}
                className={cn(
                    'p-2 rounded-lg transition-all',
                    isBookmarked
                        ? 'bg-primary/20 text-primary'
                        : 'bg-surface hover:bg-surface-hover text-text-secondary hover:text-white',
                    className
                )}
                title={isBookmarked ? 'Remove from bookmarks' : 'Add to bookmarks'}
            >
                {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                ) : isBookmarked ? (
                    <BookmarkCheck className="w-5 h-5" />
                ) : (
                    <Bookmark className="w-5 h-5" />
                )}
            </button>
        );
    }

    return (
        <button
            onClick={handleBookmark}
            disabled={isLoading}
            className={cn(
                'flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all',
                isBookmarked
                    ? 'bg-primary/20 text-primary border border-primary/30 hover:bg-primary/30'
                    : 'bg-surface hover:bg-surface-hover border border-surface-border text-text-secondary hover:text-white',
                className
            )}
        >
            {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
            ) : isBookmarked ? (
                <>
                    <BookmarkCheck className="w-5 h-5" />
                    Bookmarked
                </>
            ) : (
                <>
                    <Bookmark className="w-5 h-5" />
                    Bookmark
                </>
            )}
        </button>
    );
}
