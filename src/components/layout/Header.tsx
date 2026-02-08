'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search,
    Menu,
    X,
    User,
    BookMarked,
    History,
    Settings,
    LogOut,
    ChevronDown,
    Flame,
    TrendingUp,
    Clock,
    BookOpen,
    Crown,
} from 'lucide-react';
import SearchModal from '../ui/SearchModal';

const navLinks = [
    { href: '/', label: 'Home', icon: Flame },
    { href: '/manhwa', label: 'Browse', icon: BookOpen },
    { href: '/trending', label: 'Trending', icon: TrendingUp },
    { href: '/latest', label: 'Latest', icon: Clock },
];

const genreLinks = [
    { href: '/genre/action', label: 'Action' },
    { href: '/genre/romance', label: 'Romance' },
    { href: '/genre/fantasy', label: 'Fantasy' },
    { href: '/genre/isekai', label: 'Isekai' },
    { href: '/genre/martial-arts', label: 'Martial Arts' },
    { href: '/genre/cultivation', label: 'Cultivation' },
];

export default function Header() {
    const { data: session, status } = useSession();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [isGenreMenuOpen, setIsGenreMenuOpen] = useState(false);

    return (
        <>
            <header className="sticky top-0 z-50 w-full border-b border-surface-border bg-secondary/80 backdrop-blur-xl">
                <div className="container-custom">
                    <div className="flex h-16 items-center justify-between">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-2 group">
                            <div className="relative">
                                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center transform group-hover:scale-110 transition-transform">
                                    <BookOpen className="w-5 h-5 text-white" />
                                </div>
                                <div className="absolute -inset-1 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg blur opacity-30 group-hover:opacity-50 transition-opacity" />
                            </div>
                            <span className="text-xl font-bold font-display gradient-text hidden sm:block">
                                ManhwaReader
                            </span>
                        </Link>

                        {/* Desktop Navigation */}
                        <nav className="hidden lg:flex items-center gap-1">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="flex items-center gap-2 px-4 py-2 text-text-secondary hover:text-white hover:bg-white/5 rounded-lg transition-all"
                                >
                                    <link.icon className="w-4 h-4" />
                                    {link.label}
                                </Link>
                            ))}

                            {/* Genres Dropdown */}
                            <div className="relative">
                                <button
                                    onClick={() => setIsGenreMenuOpen(!isGenreMenuOpen)}
                                    onBlur={() => setTimeout(() => setIsGenreMenuOpen(false), 150)}
                                    className="flex items-center gap-2 px-4 py-2 text-text-secondary hover:text-white hover:bg-white/5 rounded-lg transition-all"
                                >
                                    <Crown className="w-4 h-4" />
                                    Genres
                                    <ChevronDown className={`w-4 h-4 transition-transform ${isGenreMenuOpen ? 'rotate-180' : ''}`} />
                                </button>
                                <AnimatePresence>
                                    {isGenreMenuOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            className="absolute top-full left-0 mt-2 w-48 bg-secondary border border-surface-border rounded-xl shadow-xl overflow-hidden"
                                        >
                                            {genreLinks.map((link) => (
                                                <Link
                                                    key={link.href}
                                                    href={link.href}
                                                    className="block px-4 py-2.5 text-text-secondary hover:text-white hover:bg-white/5 transition-colors"
                                                >
                                                    {link.label}
                                                </Link>
                                            ))}
                                            <div className="border-t border-surface-border">
                                                <Link
                                                    href="/genres"
                                                    className="block px-4 py-2.5 text-primary hover:bg-white/5 font-medium transition-colors"
                                                >
                                                    View All Genres →
                                                </Link>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </nav>

                        {/* Right Side */}
                        <div className="flex items-center gap-2">
                            {/* Search Button */}
                            <button
                                onClick={() => setIsSearchOpen(true)}
                                className="flex items-center gap-2 px-4 py-2 bg-surface hover:bg-surface-hover border border-surface-border rounded-lg transition-all text-text-secondary hover:text-white"
                            >
                                <Search className="w-4 h-4" />
                                <span className="hidden sm:inline text-sm">Search...</span>
                                <kbd className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 text-xs bg-secondary rounded">
                                    <span>⌘</span>K
                                </kbd>
                            </button>

                            {/* Auth Buttons / User Menu */}
                            {status === 'loading' ? (
                                <div className="w-10 h-10 rounded-full skeleton" />
                            ) : session ? (
                                <div className="relative">
                                    <button
                                        onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                        onBlur={() => setTimeout(() => setIsUserMenuOpen(false), 150)}
                                        className="flex items-center gap-2 p-1.5 hover:bg-white/5 rounded-lg transition-all"
                                    >
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                                            <span className="text-sm font-medium text-white">
                                                {session.user?.name?.[0] || session.user?.username?.[0] || 'U'}
                                            </span>
                                        </div>
                                        <ChevronDown className={`w-4 h-4 text-text-secondary transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                                    </button>

                                    <AnimatePresence>
                                        {isUserMenuOpen && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: 10 }}
                                                className="absolute right-0 top-full mt-2 w-56 bg-secondary border border-surface-border rounded-xl shadow-xl overflow-hidden"
                                            >
                                                <div className="px-4 py-3 border-b border-surface-border">
                                                    <p className="font-medium text-white">{session.user?.name || session.user?.username}</p>
                                                    <p className="text-sm text-text-muted">{session.user?.email}</p>
                                                </div>

                                                <div className="py-2">
                                                    <Link
                                                        href="/profile"
                                                        className="flex items-center gap-3 px-4 py-2.5 text-text-secondary hover:text-white hover:bg-white/5 transition-colors"
                                                    >
                                                        <User className="w-4 h-4" />
                                                        Profile
                                                    </Link>
                                                    <Link
                                                        href="/bookmarks"
                                                        className="flex items-center gap-3 px-4 py-2.5 text-text-secondary hover:text-white hover:bg-white/5 transition-colors"
                                                    >
                                                        <BookMarked className="w-4 h-4" />
                                                        Bookmarks
                                                    </Link>
                                                    <Link
                                                        href="/history"
                                                        className="flex items-center gap-3 px-4 py-2.5 text-text-secondary hover:text-white hover:bg-white/5 transition-colors"
                                                    >
                                                        <History className="w-4 h-4" />
                                                        Reading History
                                                    </Link>

                                                    {session.user?.role === 'ADMIN' && (
                                                        <Link
                                                            href="/admin"
                                                            className="flex items-center gap-3 px-4 py-2.5 text-primary hover:bg-white/5 transition-colors"
                                                        >
                                                            <Settings className="w-4 h-4" />
                                                            Admin Panel
                                                        </Link>
                                                    )}
                                                </div>

                                                <div className="border-t border-surface-border py-2">
                                                    <button
                                                        onClick={() => signOut()}
                                                        className="flex items-center gap-3 w-full px-4 py-2.5 text-red-400 hover:bg-white/5 transition-colors"
                                                    >
                                                        <LogOut className="w-4 h-4" />
                                                        Sign Out
                                                    </button>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <Link href="/auth/login" className="btn-ghost">
                                        Login
                                    </Link>
                                    <Link href="/auth/register" className="btn-primary text-sm py-2">
                                        Sign Up
                                    </Link>
                                </div>
                            )}

                            {/* Mobile Menu Button */}
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="lg:hidden p-2 hover:bg-white/5 rounded-lg transition-all"
                            >
                                {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    {/* Mobile Navigation */}
                    <AnimatePresence>
                        {isMenuOpen && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="lg:hidden border-t border-surface-border"
                            >
                                <nav className="py-4 space-y-1">
                                    {navLinks.map((link) => (
                                        <Link
                                            key={link.href}
                                            href={link.href}
                                            onClick={() => setIsMenuOpen(false)}
                                            className="flex items-center gap-3 px-4 py-3 text-text-secondary hover:text-white hover:bg-white/5 rounded-lg transition-all"
                                        >
                                            <link.icon className="w-5 h-5" />
                                            {link.label}
                                        </Link>
                                    ))}

                                    <div className="px-4 py-2">
                                        <p className="text-text-muted text-sm font-medium mb-2">Popular Genres</p>
                                        <div className="flex flex-wrap gap-2">
                                            {genreLinks.map((link) => (
                                                <Link
                                                    key={link.href}
                                                    href={link.href}
                                                    onClick={() => setIsMenuOpen(false)}
                                                    className="px-3 py-1.5 bg-surface hover:bg-surface-hover border border-surface-border rounded-lg text-sm text-text-secondary hover:text-white transition-all"
                                                >
                                                    {link.label}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                </nav>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </header>

            {/* Search Modal */}
            <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
        </>
    );
}
