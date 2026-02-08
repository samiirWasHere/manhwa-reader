'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Star, Eye, BookOpen, Flame } from 'lucide-react';
import { ManhwaWithDetails } from '@/types';
import { formatNumber, getStatusColor, getTypeColor } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface ManhwaCardProps {
    manhwa: ManhwaWithDetails;
    variant?: 'default' | 'compact' | 'featured' | 'list';
    index?: number;
    showRank?: boolean;
}

export default function ManhwaCard({ manhwa, variant = 'default', index, showRank }: { manhwa: any; variant?: 'default' | 'compact' | 'featured' | 'list'; index?: number; showRank?: boolean }) {
    const latestChapter = manhwa.chapters?.[0];

    if (variant === 'featured') {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: (index || 0) * 0.1 }}
                className="relative group"
            >
                <Link href={`/manhwa/${manhwa.slug}`}>
                    <div className="relative aspect-[3/4] rounded-2xl overflow-hidden">
                        <Image
                            src={manhwa.coverImage}
                            alt={manhwa.title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />

                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

                        {/* Hot Badge */}
                        {manhwa.isHot && (
                            <div className="absolute top-3 left-3 flex items-center gap-1 px-2.5 py-1 bg-gradient-to-r from-red-500 to-orange-500 rounded-full text-white text-xs font-bold">
                                <Flame className="w-3 h-3" />
                                HOT
                            </div>
                        )}

                        {/* Rank Badge */}
                        {showRank && index !== undefined && (
                            <div className="absolute top-3 right-3 w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-lg">#{index + 1}</span>
                            </div>
                        )}

                        {/* Content */}
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <span className={cn('badge', getTypeColor(manhwa.type))}>
                                    {manhwa.type}
                                </span>
                                <span className={cn('badge', getStatusColor(manhwa.status))}>
                                    {manhwa.status}
                                </span>
                            </div>

                            <h3 className="text-xl font-bold text-white mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                                {manhwa.title}
                            </h3>

                            <div className="flex items-center gap-4 text-sm text-text-secondary">
                                <div className="flex items-center gap-1">
                                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                    <span className="text-white font-medium">{manhwa.rating.toFixed(1)}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Eye className="w-4 h-4" />
                                    <span>{formatNumber(manhwa.viewCount)}</span>
                                </div>
                                {manhwa._count && (
                                    <div className="flex items-center gap-1">
                                        <BookOpen className="w-4 h-4" />
                                        <span>{manhwa._count.chapters} Ch</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </Link>
            </motion.div>
        );
    }

    if (variant === 'compact') {
        return (
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: (index || 0) * 0.05 }}
                className="group"
            >
                <Link href={`/manhwa/${manhwa.slug}`} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-all">
                    {showRank && index !== undefined && (
                        <div className={cn(
                            'w-8 h-8 rounded-lg flex items-center justify-center font-bold shrink-0',
                            index < 3 ? 'bg-gradient-to-br from-purple-600 to-pink-600 text-white' : 'bg-surface text-text-secondary'
                        )}>
                            {index + 1}
                        </div>
                    )}

                    <div className="relative w-12 h-16 rounded-lg overflow-hidden shrink-0">
                        <Image
                            src={manhwa.coverImage}
                            alt={manhwa.title}
                            fill
                            className="object-cover"
                            sizes="48px"
                        />
                    </div>

                    <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-white truncate group-hover:text-primary transition-colors">
                            {manhwa.title}
                        </h4>
                        <div className="flex items-center gap-2 text-xs text-text-muted mt-1">
                            <span className="flex items-center gap-1">
                                <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                                {manhwa.rating.toFixed(1)}
                            </span>
                            <span>•</span>
                            <span>{formatNumber(manhwa.viewCount)} views</span>
                        </div>
                    </div>
                </Link>
            </motion.div>
        );
    }

    if (variant === 'list') {
        return (
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: (index || 0) * 0.05 }}
                className="card card-hover p-4"
            >
                <Link href={`/manhwa/${manhwa.slug}`} className="flex gap-4">
                    <div className="relative w-24 h-32 sm:w-32 sm:h-44 rounded-xl overflow-hidden shrink-0">
                        <Image
                            src={manhwa.coverImage}
                            alt={manhwa.title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 640px) 96px, 128px"
                        />
                        {manhwa.isHot && (
                            <div className="absolute top-2 left-2 badge-hot flex items-center gap-1">
                                <Flame className="w-3 h-3" /> HOT
                            </div>
                        )}
                    </div>

                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <span className={cn('badge', getTypeColor(manhwa.type))}>
                                {manhwa.type}
                            </span>
                            <span className={cn('badge', getStatusColor(manhwa.status))}>
                                {manhwa.status}
                            </span>
                        </div>

                        <h3 className="text-lg font-semibold text-white mb-2 hover:text-primary transition-colors line-clamp-2">
                            {manhwa.title}
                        </h3>

                        <p className="text-sm text-text-secondary line-clamp-2 mb-3">
                            {manhwa.description}
                        </p>

                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-text-muted">
                            <div className="flex items-center gap-1">
                                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                <span className="text-white font-medium">{manhwa.rating.toFixed(1)}</span>
                                <span className="text-text-muted">({formatNumber(manhwa.ratingCount)})</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Eye className="w-4 h-4" />
                                {formatNumber(manhwa.viewCount)}
                            </div>
                            {manhwa._count && (
                                <div className="flex items-center gap-1">
                                    <BookOpen className="w-4 h-4" />
                                    {manhwa._count.chapters} Chapters
                                </div>
                            )}
                        </div>

                        {/* Genres */}
                        {manhwa.genres && manhwa.genres.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-3">
                                {manhwa.genres.slice(0, 4).map((genre: any) => (
                                    <span
                                        key={genre.id}
                                        className="px-2 py-1 text-xs rounded-full bg-surface border border-surface-border text-text-secondary"
                                    >
                                        {genre.name}
                                    </span>
                                ))}
                                {manhwa.genres.length > 4 && (
                                    <span className="px-2 py-1 text-xs rounded-full bg-surface border border-surface-border text-text-muted">
                                        +{manhwa.genres.length - 4}
                                    </span>
                                )}
                            </div>
                        )}
                    </div>
                </Link>
            </motion.div>
        );
    }

    // Default card variant
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: (index || 0) * 0.05 }}
            className="group"
        >
            <Link href={`/manhwa/${manhwa.slug}`}>
                <div className="relative aspect-[3/4] rounded-xl overflow-hidden mb-3">
                    <Image
                        src={manhwa.coverImage}
                        alt={manhwa.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                    />

                    {/* Overlay on hover */}
                    <div className="manga-card-overlay flex flex-col justify-end p-3">
                        <div className="flex items-center gap-2 mb-2">
                            <span className={cn('badge', getStatusColor(manhwa.status))}>
                                {manhwa.status}
                            </span>
                        </div>

                        {latestChapter && (
                            <span className="text-sm text-text-secondary">
                                Ch. {latestChapter.chapterNumber}
                            </span>
                        )}
                    </div>

                    {/* Hot badge */}
                    {manhwa.isHot && (
                        <div className="absolute top-2 left-2 badge-hot flex items-center gap-1">
                            <Flame className="w-3 h-3" /> HOT
                        </div>
                    )}

                    {/* Rating badge */}
                    <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 bg-black/70 rounded-lg backdrop-blur-sm">
                        <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                        <span className="text-xs text-white font-medium">{manhwa.rating.toFixed(1)}</span>
                    </div>
                </div>

                <div>
                    <span className={cn('badge text-[10px] mb-1.5', getTypeColor(manhwa.type))}>
                        {manhwa.type}
                    </span>
                    <h3 className="font-medium text-white line-clamp-2 group-hover:text-primary transition-colors">
                        {manhwa.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-1 text-xs text-text-muted">
                        <span>{formatNumber(manhwa.viewCount)} views</span>
                        {manhwa._count && (
                            <>
                                <span>•</span>
                                <span>{manhwa._count.chapters} ch</span>
                            </>
                        )}
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}
