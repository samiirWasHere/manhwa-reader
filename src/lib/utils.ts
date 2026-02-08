import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatNumber(num: number): string {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
}

export function formatDate(date: Date | string): string {
    const d = new Date(date);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        if (diffHours === 0) {
            const diffMinutes = Math.floor(diffMs / (1000 * 60));
            return diffMinutes <= 1 ? 'Just now' : `${diffMinutes}m ago`;
        }
        return `${diffHours}h ago`;
    }
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)}mo ago`;
    return `${Math.floor(diffDays / 365)}y ago`;
}

export function slugify(text: string): string {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '');
}

export function getStatusColor(status: string): string {
    const colors: Record<string, string> = {
        ONGOING: 'text-green-400 bg-green-400/10',
        COMPLETED: 'text-blue-400 bg-blue-400/10',
        HIATUS: 'text-yellow-400 bg-yellow-400/10',
        DROPPED: 'text-red-400 bg-red-400/10',
    };
    return colors[status] || 'text-gray-400 bg-gray-400/10';
}

export function getTypeColor(type: string): string {
    const colors: Record<string, string> = {
        MANHWA: 'text-purple-400 bg-purple-400/10',
        MANGA: 'text-pink-400 bg-pink-400/10',
        MANHUA: 'text-orange-400 bg-orange-400/10',
        WEBTOON: 'text-cyan-400 bg-cyan-400/10',
    };
    return colors[type] || 'text-gray-400 bg-gray-400/10';
}

export function parsePages(pagesJson: string): string[] {
    try {
        return JSON.parse(pagesJson);
    } catch {
        return [];
    }
}

export function getChapterTitle(chapter: { chapterNumber: number; title?: string | null }): string {
    const num = chapter.chapterNumber % 1 === 0 ? chapter.chapterNumber.toString() : chapter.chapterNumber.toFixed(1);
    return chapter.title ? `Chapter ${num}: ${chapter.title}` : `Chapter ${num}`;
}
