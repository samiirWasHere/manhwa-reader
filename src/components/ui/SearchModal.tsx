'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Clock, TrendingUp, Loader2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface SearchResult {
    id: string;
    title: string;
    slug: string;
    coverImage: string;
    type: string;
    status: string;
}

interface SearchModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SearchResult[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [recentSearches, setRecentSearches] = useState<string[]>([]);
    const router = useRouter();

    // Load recent searches from localStorage
    useEffect(() => {
        const saved = localStorage.getItem('recentSearches');
        if (saved) {
            setRecentSearches(JSON.parse(saved));
        }
    }, []);

    // Keyboard shortcut
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                if (isOpen) {
                    onClose();
                }
            }
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    // Search function with debouncing
    const searchManhwa = useCallback(async (searchQuery: string) => {
        if (!searchQuery.trim()) {
            setResults([]);
            return;
        }

        setIsLoading(true);
        try {
            const res = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}&limit=6`);
            const data = await res.json();
            if (data.success) {
                setResults(data.data);
            }
        } catch (error) {
            console.error('Search error:', error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Debounced search
    useEffect(() => {
        const timer = setTimeout(() => {
            searchManhwa(query);
        }, 300);

        return () => clearTimeout(timer);
    }, [query, searchManhwa]);

    const handleSelect = (slug: string, title: string) => {
        // Save to recent searches
        const updated = [title, ...recentSearches.filter((s) => s !== title)].slice(0, 5);
        setRecentSearches(updated);
        localStorage.setItem('recentSearches', JSON.stringify(updated));

        router.push(`/manhwa/${slug}`);
        onClose();
        setQuery('');
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            router.push(`/manhwa?search=${encodeURIComponent(query)}`);
            onClose();
            setQuery('');
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -20 }}
                    className="w-full max-w-2xl mx-auto mt-20 bg-secondary border border-surface-border rounded-2xl shadow-2xl overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Search Input */}
                    <form onSubmit={handleSubmit} className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search manhwa, manga, webtoons..."
                            className="w-full pl-12 pr-12 py-4 bg-transparent text-white text-lg placeholder:text-text-muted focus:outline-none"
                            autoFocus
                        />
                        {query && (
                            <button
                                type="button"
                                onClick={() => setQuery('')}
                                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-white/10 rounded-full transition-colors"
                            >
                                <X className="w-4 h-4 text-text-muted" />
                            </button>
                        )}
                    </form>

                    <div className="border-t border-surface-border">
                        {isLoading ? (
                            <div className="flex items-center justify-center py-12">
                                <Loader2 className="w-6 h-6 text-primary animate-spin" />
                            </div>
                        ) : query ? (
                            results.length > 0 ? (
                                <div className="py-2">
                                    <p className="px-4 py-2 text-xs font-medium text-text-muted uppercase">
                                        Results
                                    </p>
                                    {results.map((result) => (
                                        <button
                                            key={result.id}
                                            onClick={() => handleSelect(result.slug, result.title)}
                                            className="w-full flex items-center gap-4 px-4 py-3 hover:bg-white/5 transition-colors"
                                        >
                                            <div className="relative w-12 h-16 rounded-lg overflow-hidden bg-surface flex-shrink-0">
                                                <Image
                                                    src={result.coverImage}
                                                    alt={result.title}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                            <div className="flex-1 text-left">
                                                <h4 className="font-medium text-white line-clamp-1">
                                                    {result.title}
                                                </h4>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-xs px-2 py-0.5 rounded bg-purple-500/20 text-purple-400">
                                                        {result.type}
                                                    </span>
                                                    <span className="text-xs text-text-muted">
                                                        {result.status}
                                                    </span>
                                                </div>
                                            </div>
                                        </button>
                                    ))}
                                    <div className="px-4 py-2 border-t border-surface-border">
                                        <button
                                            onClick={handleSubmit}
                                            className="text-sm text-primary hover:underline"
                                        >
                                            View all results for &quot;{query}&quot; →
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="py-12 text-center">
                                    <p className="text-text-muted">No results found for &quot;{query}&quot;</p>
                                </div>
                            )
                        ) : (
                            <div className="py-4">
                                {/* Recent Searches */}
                                {recentSearches.length > 0 && (
                                    <div className="mb-4">
                                        <p className="px-4 py-2 text-xs font-medium text-text-muted uppercase flex items-center gap-2">
                                            <Clock className="w-3 h-3" />
                                            Recent Searches
                                        </p>
                                        {recentSearches.map((search, index) => (
                                            <button
                                                key={index}
                                                onClick={() => setQuery(search)}
                                                className="w-full px-4 py-2.5 text-left text-text-secondary hover:text-white hover:bg-white/5 transition-colors"
                                            >
                                                {search}
                                            </button>
                                        ))}
                                    </div>
                                )}

                                {/* Trending */}
                                <div>
                                    <p className="px-4 py-2 text-xs font-medium text-text-muted uppercase flex items-center gap-2">
                                        <TrendingUp className="w-3 h-3" />
                                        Trending Now
                                    </p>
                                    <div className="px-4 py-2 flex flex-wrap gap-2">
                                        {['Solo Leveling', 'Tower of God', 'Omniscient Reader', 'The Beginning After The End'].map((term) => (
                                            <button
                                                key={term}
                                                onClick={() => setQuery(term)}
                                                className="px-3 py-1.5 rounded-full bg-surface hover:bg-surface-hover border border-surface-border text-sm text-text-secondary hover:text-white transition-all"
                                            >
                                                {term}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="px-4 py-3 border-t border-surface-border bg-surface/50 flex items-center justify-between text-xs text-text-muted">
                        <div className="flex items-center gap-4">
                            <span className="flex items-center gap-1">
                                <kbd className="px-1.5 py-0.5 bg-secondary rounded">↵</kbd> to select
                            </span>
                            <span className="flex items-center gap-1">
                                <kbd className="px-1.5 py-0.5 bg-secondary rounded">esc</kbd> to close
                            </span>
                        </div>
                        <Link href="/manhwa" className="hover:text-white" onClick={onClose}>
                            Browse all →
                        </Link>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
