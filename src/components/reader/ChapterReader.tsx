'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ChevronLeft,
    ChevronRight,
    ChevronUp,
    ChevronDown,
    Home,
    List,
    Settings,
    X,
    Maximize,
    Minimize,
    Sun,
    Moon,
} from 'lucide-react';
import { Chapter } from '@prisma/client';
import { parsePages, getChapterTitle, cn } from '@/lib/utils';

interface ChapterReaderProps {
    manhwa: { id: string; title: string; slug: string };
    chapter: Chapter;
    allChapters: { id: string; slug: string; chapterNumber: number; title: string | null }[];
    prevChapter: { slug: string; chapterNumber: number } | null;
    nextChapter: { slug: string; chapterNumber: number } | null;
}

export default function ChapterReader({
    manhwa,
    chapter,
    allChapters,
    prevChapter,
    nextChapter,
}: ChapterReaderProps) {
    const router = useRouter();
    const pages = parsePages(chapter.pages);

    const [showControls, setShowControls] = useState(true);
    const [showChapterList, setShowChapterList] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [readingMode, setReadingMode] = useState<'scroll' | 'page'>('scroll');
    const [currentPage, setCurrentPage] = useState(0);
    const [bgColor, setBgColor] = useState<'dark' | 'black' | 'sepia'>('dark');

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowLeft' || e.key === 'a') {
                if (readingMode === 'page' && currentPage > 0) {
                    setCurrentPage((p) => p - 1);
                } else if (prevChapter) {
                    router.push(`/read/${manhwa.slug}/${prevChapter.slug}`);
                }
            }
            if (e.key === 'ArrowRight' || e.key === 'd') {
                if (readingMode === 'page' && currentPage < pages.length - 1) {
                    setCurrentPage((p) => p + 1);
                } else if (nextChapter) {
                    router.push(`/read/${manhwa.slug}/${nextChapter.slug}`);
                }
            }
            if (e.key === 'f') {
                toggleFullscreen();
            }
            if (e.key === 'Escape') {
                setShowChapterList(false);
                setShowSettings(false);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [currentPage, pages.length, prevChapter, nextChapter, readingMode, manhwa.slug, router]);

    // Auto-hide controls
    useEffect(() => {
        let timeout: NodeJS.Timeout;
        const handleMouseMove = () => {
            setShowControls(true);
            clearTimeout(timeout);
            timeout = setTimeout(() => setShowControls(false), 3000);
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            clearTimeout(timeout);
        };
    }, []);

    const toggleFullscreen = useCallback(() => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
            setIsFullscreen(true);
        } else {
            document.exitFullscreen();
            setIsFullscreen(false);
        }
    }, []);

    const bgColors = {
        dark: 'bg-secondary',
        black: 'bg-black',
        sepia: 'bg-amber-50',
    };

    return (
        <div className={cn('min-h-screen', bgColors[bgColor])}>
            {/* Top Bar */}
            <AnimatePresence>
                {showControls && (
                    <motion.header
                        initial={{ y: -100 }}
                        animate={{ y: 0 }}
                        exit={{ y: -100 }}
                        className="fixed top-0 left-0 right-0 z-50 bg-secondary/95 backdrop-blur-lg border-b border-surface-border"
                    >
                        <div className="container-custom py-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Link
                                        href={`/manhwa/${manhwa.slug}`}
                                        className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                                    >
                                        <ChevronLeft className="w-5 h-5" />
                                    </Link>
                                    <div className="min-w-0">
                                        <Link
                                            href={`/manhwa/${manhwa.slug}`}
                                            className="block font-medium text-white truncate hover:text-primary transition-colors"
                                        >
                                            {manhwa.title}
                                        </Link>
                                        <p className="text-sm text-text-muted truncate">
                                            {getChapterTitle(chapter)}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-1">
                                    <Link
                                        href="/"
                                        className="p-2.5 hover:bg-white/5 rounded-lg transition-colors"
                                        title="Home"
                                    >
                                        <Home className="w-5 h-5 text-text-secondary" />
                                    </Link>
                                    <button
                                        onClick={() => setShowChapterList(true)}
                                        className="p-2.5 hover:bg-white/5 rounded-lg transition-colors"
                                        title="Chapter List"
                                    >
                                        <List className="w-5 h-5 text-text-secondary" />
                                    </button>
                                    <button
                                        onClick={() => setShowSettings(true)}
                                        className="p-2.5 hover:bg-white/5 rounded-lg transition-colors"
                                        title="Settings"
                                    >
                                        <Settings className="w-5 h-5 text-text-secondary" />
                                    </button>
                                    <button
                                        onClick={toggleFullscreen}
                                        className="p-2.5 hover:bg-white/5 rounded-lg transition-colors"
                                        title="Fullscreen"
                                    >
                                        {isFullscreen ? (
                                            <Minimize className="w-5 h-5 text-text-secondary" />
                                        ) : (
                                            <Maximize className="w-5 h-5 text-text-secondary" />
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.header>
                )}
            </AnimatePresence>

            {/* Reader Content */}
            <div className="pt-16 pb-20">
                {readingMode === 'scroll' ? (
                    <div className="max-w-4xl mx-auto px-2">
                        {pages.map((page, index) => (
                            <div key={index} className="relative w-full">
                                <Image
                                    src={page}
                                    alt={`Page ${index + 1}`}
                                    width={900}
                                    height={1400}
                                    className="w-full h-auto"
                                    priority={index < 3}
                                    loading={index < 3 ? 'eager' : 'lazy'}
                                />
                            </div>
                        ))}

                        {/* End of Chapter */}
                        <div className="py-12 text-center">
                            <p className="text-text-muted mb-4">End of Chapter {chapter.chapterNumber}</p>
                            <div className="flex justify-center gap-4">
                                {prevChapter && (
                                    <Link
                                        href={`/read/${manhwa.slug}/${prevChapter.slug}`}
                                        className="btn-secondary flex items-center gap-2"
                                    >
                                        <ChevronLeft className="w-4 h-4" />
                                        Previous
                                    </Link>
                                )}
                                {nextChapter && (
                                    <Link
                                        href={`/read/${manhwa.slug}/${nextChapter.slug}`}
                                        className="btn-primary flex items-center gap-2"
                                    >
                                        Next
                                        <ChevronRight className="w-4 h-4" />
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                ) : (
                    // Page mode
                    <div className="relative h-[calc(100vh-9rem)] flex items-center justify-center">
                        {pages[currentPage] && (
                            <Image
                                src={pages[currentPage]}
                                alt={`Page ${currentPage + 1}`}
                                fill
                                className="object-contain"
                                priority
                            />
                        )}

                        {/* Page navigation */}
                        <button
                            onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
                            disabled={currentPage === 0}
                            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-black/50 hover:bg-black/70 rounded-full disabled:opacity-50"
                        >
                            <ChevronLeft className="w-6 h-6" />
                        </button>
                        <button
                            onClick={() => setCurrentPage((p) => Math.min(pages.length - 1, p + 1))}
                            disabled={currentPage === pages.length - 1}
                            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-black/50 hover:bg-black/70 rounded-full disabled:opacity-50"
                        >
                            <ChevronRight className="w-6 h-6" />
                        </button>
                    </div>
                )}
            </div>

            {/* Bottom Bar */}
            <AnimatePresence>
                {showControls && (
                    <motion.footer
                        initial={{ y: 100 }}
                        animate={{ y: 0 }}
                        exit={{ y: 100 }}
                        className="fixed bottom-0 left-0 right-0 z-50 bg-secondary/95 backdrop-blur-lg border-t border-surface-border"
                    >
                        <div className="container-custom py-3">
                            <div className="flex items-center justify-between">
                                {prevChapter ? (
                                    <Link
                                        href={`/read/${manhwa.slug}/${prevChapter.slug}`}
                                        className="flex items-center gap-2 px-4 py-2 hover:bg-white/5 rounded-lg transition-colors"
                                    >
                                        <ChevronLeft className="w-5 h-5" />
                                        <span className="hidden sm:inline">Ch. {prevChapter.chapterNumber}</span>
                                    </Link>
                                ) : (
                                    <div />
                                )}

                                <div className="flex items-center gap-2">
                                    {readingMode === 'page' && (
                                        <span className="text-sm text-text-secondary">
                                            {currentPage + 1} / {pages.length}
                                        </span>
                                    )}
                                </div>

                                {nextChapter ? (
                                    <Link
                                        href={`/read/${manhwa.slug}/${nextChapter.slug}`}
                                        className="flex items-center gap-2 px-4 py-2 hover:bg-white/5 rounded-lg transition-colors"
                                    >
                                        <span className="hidden sm:inline">Ch. {nextChapter.chapterNumber}</span>
                                        <ChevronRight className="w-5 h-5" />
                                    </Link>
                                ) : (
                                    <div />
                                )}
                            </div>
                        </div>
                    </motion.footer>
                )}
            </AnimatePresence>

            {/* Chapter List Modal */}
            <AnimatePresence>
                {showChapterList && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
                        onClick={() => setShowChapterList(false)}
                    >
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            className="absolute right-0 top-0 h-full w-80 bg-secondary border-l border-surface-border overflow-y-auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="sticky top-0 bg-secondary border-b border-surface-border p-4 flex items-center justify-between">
                                <h3 className="font-semibold text-white">Chapters</h3>
                                <button onClick={() => setShowChapterList(false)}>
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="p-2">
                                {allChapters.map((ch) => (
                                    <Link
                                        key={ch.id}
                                        href={`/read/${manhwa.slug}/${ch.slug}`}
                                        onClick={() => setShowChapterList(false)}
                                        className={cn(
                                            'block px-4 py-3 rounded-lg transition-colors',
                                            ch.id === chapter.id
                                                ? 'bg-primary/20 text-primary'
                                                : 'hover:bg-white/5 text-text-secondary hover:text-white'
                                        )}
                                    >
                                        {getChapterTitle(ch)}
                                    </Link>
                                ))}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Settings Modal */}
            <AnimatePresence>
                {showSettings && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center"
                        onClick={() => setShowSettings(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="w-full max-w-md bg-secondary border border-surface-border rounded-2xl overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="p-4 border-b border-surface-border flex items-center justify-between">
                                <h3 className="font-semibold text-white">Reader Settings</h3>
                                <button onClick={() => setShowSettings(false)}>
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="p-4 space-y-6">
                                {/* Reading Mode */}
                                <div>
                                    <label className="block text-sm text-text-muted mb-2">Reading Mode</label>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setReadingMode('scroll')}
                                            className={cn(
                                                'flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-all',
                                                readingMode === 'scroll'
                                                    ? 'bg-primary text-white'
                                                    : 'bg-surface hover:bg-surface-hover text-text-secondary'
                                            )}
                                        >
                                            <ChevronDown className="w-4 h-4" />
                                            Scroll
                                        </button>
                                        <button
                                            onClick={() => setReadingMode('page')}
                                            className={cn(
                                                'flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-all',
                                                readingMode === 'page'
                                                    ? 'bg-primary text-white'
                                                    : 'bg-surface hover:bg-surface-hover text-text-secondary'
                                            )}
                                        >
                                            <ChevronRight className="w-4 h-4" />
                                            Page
                                        </button>
                                    </div>
                                </div>

                                {/* Background Color */}
                                <div>
                                    <label className="block text-sm text-text-muted mb-2">Background</label>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setBgColor('dark')}
                                            className={cn(
                                                'flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-all',
                                                bgColor === 'dark'
                                                    ? 'ring-2 ring-primary'
                                                    : ''
                                            )}
                                            style={{ background: '#1a1a2e' }}
                                        >
                                            <Moon className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => setBgColor('black')}
                                            className={cn(
                                                'flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-all bg-black',
                                                bgColor === 'black'
                                                    ? 'ring-2 ring-primary'
                                                    : ''
                                            )}
                                        >
                                            <span className="text-white">Black</span>
                                        </button>
                                        <button
                                            onClick={() => setBgColor('sepia')}
                                            className={cn(
                                                'flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-all bg-amber-50',
                                                bgColor === 'sepia'
                                                    ? 'ring-2 ring-primary'
                                                    : ''
                                            )}
                                        >
                                            <Sun className="w-4 h-4 text-amber-600" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
