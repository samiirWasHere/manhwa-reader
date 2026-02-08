'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import useSWR from 'swr';
import { motion } from 'framer-motion';
import { Filter, Grid, List, X } from 'lucide-react';
import ManhwaCard from '@/components/ui/ManhwaCard';
import Pagination from '@/components/ui/Pagination';
import { CardGridSkeleton } from '@/components/ui/LoadingSpinner';
import { ManhwaWithDetails, PaginatedResponse } from '@/types';
import { cn } from '@/lib/utils';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const statusOptions = [
    { value: '', label: 'All Status' },
    { value: 'ONGOING', label: 'Ongoing' },
    { value: 'COMPLETED', label: 'Completed' },
    { value: 'HIATUS', label: 'Hiatus' },
];

const typeOptions = [
    { value: '', label: 'All Types' },
    { value: 'MANHWA', label: 'Manhwa' },
    { value: 'MANGA', label: 'Manga' },
    { value: 'MANHUA', label: 'Manhua' },
    { value: 'WEBTOON', label: 'Webtoon' },
];

const sortOptions = [
    { value: 'latest', label: 'Latest Update' },
    { value: 'popular', label: 'Most Popular' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'alphabetical', label: 'A-Z' },
];

export default function ManhwaListPage() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    // Get params
    const page = parseInt(searchParams.get('page') || '1');
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';
    const type = searchParams.get('type') || '';
    const genres = searchParams.get('genres') || '';
    const sort = searchParams.get('sort') || 'latest';

    // Build query string
    const queryParams = new URLSearchParams();
    queryParams.set('page', page.toString());
    queryParams.set('limit', '20');
    if (search) queryParams.set('search', search);
    if (status) queryParams.set('status', status);
    if (type) queryParams.set('type', type);
    if (genres) queryParams.set('genres', genres);
    if (sort) queryParams.set('sort', sort);

    // Fetch data
    const { data, isLoading, error } = useSWR<{ success: boolean; data: PaginatedResponse<ManhwaWithDetails> }>(
        `/api/manhwa?${queryParams.toString()}`,
        fetcher
    );

    // Fetch genres for filter
    const { data: genreData } = useSWR<{ success: boolean; data: { id: string; name: string; slug: string }[] }>(
        '/api/genres',
        fetcher
    );

    const updateFilters = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value) {
            params.set(key, value);
        } else {
            params.delete(key);
        }
        params.set('page', '1'); // Reset to first page
        router.push(`/manhwa?${params.toString()}`);
    };

    const handlePageChange = (newPage: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('page', newPage.toString());
        router.push(`/manhwa?${params.toString()}`);
    };

    const clearFilters = () => {
        router.push('/manhwa');
    };

    const activeFiltersCount = [status, type, genres, search].filter(Boolean).length;

    return (
        <div className="min-h-screen py-8">
            <div className="container-custom">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">Browse Manhwa</h1>
                    <p className="text-text-secondary">
                        Discover thousands of manhwa, manga, and webtoons
                    </p>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Filters Sidebar - Desktop */}
                    <aside className="hidden lg:block w-64 shrink-0">
                        <div className="card p-4 sticky top-24">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-semibold text-white">Filters</h3>
                                {activeFiltersCount > 0 && (
                                    <button
                                        onClick={clearFilters}
                                        className="text-xs text-primary hover:underline"
                                    >
                                        Clear all
                                    </button>
                                )}
                            </div>

                            <div className="space-y-4">
                                {/* Status Filter */}
                                <div>
                                    <label className="block text-sm text-text-muted mb-2">Status</label>
                                    <select
                                        value={status}
                                        onChange={(e) => updateFilters('status', e.target.value)}
                                        className="input-field text-sm"
                                    >
                                        {statusOptions.map((opt) => (
                                            <option key={opt.value} value={opt.value}>
                                                {opt.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Type Filter */}
                                <div>
                                    <label className="block text-sm text-text-muted mb-2">Type</label>
                                    <select
                                        value={type}
                                        onChange={(e) => updateFilters('type', e.target.value)}
                                        className="input-field text-sm"
                                    >
                                        {typeOptions.map((opt) => (
                                            <option key={opt.value} value={opt.value}>
                                                {opt.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Sort */}
                                <div>
                                    <label className="block text-sm text-text-muted mb-2">Sort By</label>
                                    <select
                                        value={sort}
                                        onChange={(e) => updateFilters('sort', e.target.value)}
                                        className="input-field text-sm"
                                    >
                                        {sortOptions.map((opt) => (
                                            <option key={opt.value} value={opt.value}>
                                                {opt.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Genres */}
                                {genreData?.data && (
                                    <div>
                                        <label className="block text-sm text-text-muted mb-2">Genres</label>
                                        <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto">
                                            {genreData.data.map((genre) => {
                                                const isSelected = genres.split(',').includes(genre.slug);
                                                return (
                                                    <button
                                                        key={genre.id}
                                                        onClick={() => {
                                                            const current = genres ? genres.split(',') : [];
                                                            const updated = isSelected
                                                                ? current.filter((g) => g !== genre.slug)
                                                                : [...current, genre.slug];
                                                            updateFilters('genres', updated.join(','));
                                                        }}
                                                        className={cn(
                                                            'px-2.5 py-1 rounded-full text-xs transition-all',
                                                            isSelected
                                                                ? 'bg-primary text-white'
                                                                : 'bg-surface hover:bg-surface-hover border border-surface-border text-text-secondary'
                                                        )}
                                                    >
                                                        {genre.name}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <div className="flex-1">
                        {/* Toolbar */}
                        <div className="flex items-center justify-between gap-4 mb-6">
                            <div className="flex items-center gap-2">
                                {/* Mobile Filter Button */}
                                <button
                                    onClick={() => setIsFilterOpen(true)}
                                    className="lg:hidden flex items-center gap-2 px-4 py-2 bg-surface border border-surface-border rounded-lg text-text-secondary"
                                >
                                    <Filter className="w-4 h-4" />
                                    Filters
                                    {activeFiltersCount > 0 && (
                                        <span className="w-5 h-5 bg-primary rounded-full text-xs text-white flex items-center justify-center">
                                            {activeFiltersCount}
                                        </span>
                                    )}
                                </button>

                                {data?.data && (
                                    <span className="text-sm text-text-muted">
                                        {data.data.total} results
                                    </span>
                                )}
                            </div>

                            {/* View Toggle */}
                            <div className="flex items-center gap-1 p-1 bg-surface rounded-lg">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={cn(
                                        'p-2 rounded-lg transition-all',
                                        viewMode === 'grid' ? 'bg-primary text-white' : 'text-text-muted hover:text-white'
                                    )}
                                >
                                    <Grid className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={cn(
                                        'p-2 rounded-lg transition-all',
                                        viewMode === 'list' ? 'bg-primary text-white' : 'text-text-muted hover:text-white'
                                    )}
                                >
                                    <List className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {/* Active Filters */}
                        {activeFiltersCount > 0 && (
                            <div className="flex flex-wrap items-center gap-2 mb-6">
                                <span className="text-sm text-text-muted">Active:</span>
                                {search && (
                                    <button
                                        onClick={() => updateFilters('search', '')}
                                        className="flex items-center gap-1 px-3 py-1 bg-surface border border-surface-border rounded-full text-sm"
                                    >
                                        Search: {search}
                                        <X className="w-3 h-3" />
                                    </button>
                                )}
                                {status && (
                                    <button
                                        onClick={() => updateFilters('status', '')}
                                        className="flex items-center gap-1 px-3 py-1 bg-surface border border-surface-border rounded-full text-sm"
                                    >
                                        Status: {status}
                                        <X className="w-3 h-3" />
                                    </button>
                                )}
                                {type && (
                                    <button
                                        onClick={() => updateFilters('type', '')}
                                        className="flex items-center gap-1 px-3 py-1 bg-surface border border-surface-border rounded-full text-sm"
                                    >
                                        Type: {type}
                                        <X className="w-3 h-3" />
                                    </button>
                                )}
                            </div>
                        )}

                        {/* Results */}
                        {isLoading ? (
                            <CardGridSkeleton count={20} />
                        ) : error ? (
                            <div className="card p-12 text-center">
                                <p className="text-red-400">Error loading manhwa. Please try again.</p>
                            </div>
                        ) : data?.data && data.data.data.length > 0 ? (
                            <>
                                {viewMode === 'grid' ? (
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
                                        {data.data.data.map((manhwa: any, index: number) => (
                                            <ManhwaCard key={manhwa.id} manhwa={manhwa} index={index} />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {data.data.data.map((manhwa: any, index: number) => (
                                            <ManhwaCard key={manhwa.id} manhwa={manhwa} variant="list" index={index} />
                                        ))}
                                    </div>
                                )}

                                {/* Pagination */}
                                <Pagination
                                    currentPage={data.data.page}
                                    totalPages={data.data.totalPages}
                                    onPageChange={handlePageChange}
                                    className="mt-8"
                                />
                            </>
                        ) : (
                            <div className="card p-12 text-center">
                                <p className="text-text-muted mb-4">No manhwa found matching your filters.</p>
                                <button onClick={clearFilters} className="btn-primary">
                                    Clear Filters
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Mobile Filter Modal */}
                {isFilterOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:hidden"
                        onClick={() => setIsFilterOpen(false)}
                    >
                        <motion.div
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            className="absolute left-0 top-0 h-full w-80 bg-secondary p-6 overflow-y-auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-semibold text-white">Filters</h3>
                                <button onClick={() => setIsFilterOpen(false)}>
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            {/* Same filter content as sidebar */}
                            {/* ... */}
                        </motion.div>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
