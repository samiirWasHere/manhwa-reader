import Link from 'next/link';
import { BookOpen, Github, Twitter, Mail, Heart } from 'lucide-react';

const footerLinks = {
    browse: [
        { href: '/manhwa', label: 'All Manhwa' },
        { href: '/trending', label: 'Trending' },
        { href: '/latest', label: 'Latest Updates' },
        { href: '/genres', label: 'All Genres' },
    ],
    genres: [
        { href: '/genre/action', label: 'Action' },
        { href: '/genre/romance', label: 'Romance' },
        { href: '/genre/fantasy', label: 'Fantasy' },
        { href: '/genre/martial-arts', label: 'Martial Arts' },
    ],
    support: [
        { href: '/about', label: 'About Us' },
        { href: '/contact', label: 'Contact' },
        { href: '/dmca', label: 'DMCA' },
        { href: '/privacy', label: 'Privacy Policy' },
    ],
};

export default function Footer() {
    return (
        <footer className="mt-auto border-t border-surface-border bg-secondary/50">
            <div className="container-custom py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
                    {/* Brand */}
                    <div className="lg:col-span-2">
                        <Link href="/" className="flex items-center gap-2 mb-4">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                                <BookOpen className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-xl font-bold font-display gradient-text">
                                ManhwaReader
                            </span>
                        </Link>
                        <p className="text-text-secondary text-sm mb-4 max-w-sm">
                            Your ultimate destination for reading manhwa, manga, and webtoons online.
                            Updated daily with the latest chapters from your favorite series.
                        </p>
                        <div className="flex items-center gap-3">
                            <a
                                href="#"
                                className="w-10 h-10 rounded-lg bg-surface hover:bg-surface-hover border border-surface-border flex items-center justify-center transition-all hover:scale-110"
                            >
                                <Twitter className="w-4 h-4 text-text-secondary" />
                            </a>
                            <a
                                href="#"
                                className="w-10 h-10 rounded-lg bg-surface hover:bg-surface-hover border border-surface-border flex items-center justify-center transition-all hover:scale-110"
                            >
                                <Github className="w-4 h-4 text-text-secondary" />
                            </a>
                            <a
                                href="#"
                                className="w-10 h-10 rounded-lg bg-surface hover:bg-surface-hover border border-surface-border flex items-center justify-center transition-all hover:scale-110"
                            >
                                <Mail className="w-4 h-4 text-text-secondary" />
                            </a>
                        </div>
                    </div>

                    {/* Browse Links */}
                    <div>
                        <h3 className="font-semibold text-white mb-4">Browse</h3>
                        <ul className="space-y-2">
                            {footerLinks.browse.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-text-secondary hover:text-white transition-colors text-sm"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Genre Links */}
                    <div>
                        <h3 className="font-semibold text-white mb-4">Popular Genres</h3>
                        <ul className="space-y-2">
                            {footerLinks.genres.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-text-secondary hover:text-white transition-colors text-sm"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Support Links */}
                    <div>
                        <h3 className="font-semibold text-white mb-4">Support</h3>
                        <ul className="space-y-2">
                            {footerLinks.support.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-text-secondary hover:text-white transition-colors text-sm"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-12 pt-8 border-t border-surface-border flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-text-muted text-sm">
                        © {new Date().getFullYear()} ManhwaReader. All rights reserved.
                    </p>
                    <p className="text-text-muted text-sm flex items-center gap-1">
                        Made with <Heart className="w-4 h-4 text-red-500 fill-red-500" /> for manga lovers
                    </p>
                </div>
            </div>
        </footer>
    );
}
