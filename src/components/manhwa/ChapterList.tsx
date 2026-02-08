'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Chapter } from '@prisma/client';
import { Clock, Eye, ChevronDown, ChevronUp, Search } from 'lucide-react';
import { formatDate, getChapterTitle } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface ChapterListProps {
    chapters: Chapter[];
    manhwaSlug: string;
    currentChapterId?: string;
}

export default function ChapterList({ chapters, manhwaSlug, currentChapterId }: ChapterListProps) {
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
    const [searchQuery, setSearchQuery] = useState('');
    const [showAll, setShowAll] = useState(false);

    const sortedChapters = [...chapters].sort((a, b) => {
        return sortOrder === 'desc'
            ? b.chapterNumber - a.chapterNumber
            : a.chapterNumber - b.chapterNumber;
    });

    const filteredChapters = sortedChapters.filter((chapter) => {
        if (!searchQuery) return true;
        const chapterNum = chapter.chapterNumber.toString();
        const title = chapter.title?.toLowerCase() || '';
        return chapterNum.includes(searchQuery) || title.includes(searchQuery.toLowerCase());
    });

    const displayedChapters = showAll ? filteredChapters : filteredChapters.slice(0, 20);

    return (
        <div>
            {/* Controls */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search chapters..."
                        className="input-field pl-10 py-2 text-sm"
                    />
                </div>
                <button
                    onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-surface hover:bg-surface-hover border border-surface-border rounded-lg text-sm text-text-secondary hover:text-white transition-all"
                >
                    {sortOrder === 'desc' ? (
                        <>
                            <ChevronDown className="w-4 h-4" />
                            Newest First
                        </>
                    ) : (
                        <>
                            <ChevronUp className="w-4 h-4" />
                            Oldest First
                        </>
                    )}
                </button>
            </div>

            {/* Chapter List */}
            <div className="space-y-1">
                {displayedChapters.map((chapter) => (
                    <Link
                        key={chapter.id}
                        href={`/read/${manhwaSlug}/${chapter.slug}`}
                        className={cn(
                            'flex items-center justify-between p-3 rounded-lg transition-all group',
                            chapter.id === currentChapterId
                                ? 'bg-primary/20 border border-primary/30'
                                : 'hover:bg-white/5'
                        )}
                    >
                        <div className="flex-1 min-w-0">
                            <h4 className={cn(
                                'font-medium truncate group-hover:text-primary transition-colors',
                                chapter.id === currentChapterId ? 'text-primary' : 'text-white'
                            )}>
                                {getChapterTitle(chapter)}
                            </h4>
                            <div className="flex items-center gap-3 text-xs text-text-muted mt-0.5">
                                <span className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {formatDate(chapter.createdAt)}
                                </span>
                                {chapter.viewCount > 0 && (
                                    <span className="flex items-center gap-1">
                                        <Eye className="w-3 h-3" />
                                        {chapter.viewCount.toLocaleString()}
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className="text-xs text-text-muted ml-3">
                            {chapter.pageCount} pages
                        </div>
                    </Link>
                ))}
            </div>

            {/* Show More Button */}
            {filteredChapters.length > 20 && !showAll && (
                <button
                    onClick={() => setShowAll(true)}
                    className="w-full mt-4 py-3 text-center text-sm text-primary hover:underline border-t border-surface-border"
                >
                    Show All {filteredChapters.length} Chapters
                </button>
            )}

            {filteredChapters.length === 0 && (
                <div className="text-center py-8 text-text-muted">
                    No chapters found
                </div>
            )}
        </div>
    );
}
