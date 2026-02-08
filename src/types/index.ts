import { Manhwa, Chapter, Genre, User } from '@prisma/client';

export interface ManhwaWithDetails extends Manhwa {
    genres: Genre[];
    chapters?: Chapter[];
    _count?: {
        chapters: number;
        bookmarks: number;
        comments: number;
    };
}

export interface ChapterWithManhwa extends Chapter {
    manhwa: Manhwa;
}

export interface ManhwaCardProps {
    manhwa: ManhwaWithDetails;
    variant?: 'default' | 'compact' | 'featured';
    showRating?: boolean;
}

export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
}

export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
}

export interface SearchFilters {
    query?: string;
    genres?: string[];
    status?: string;
    type?: string;
    sortBy?: 'latest' | 'popular' | 'rating' | 'alphabetical';
    page?: number;
    limit?: number;
}

export interface ScraperConfig {
    name: string;
    baseUrl: string;
    selectors: {
        title: string;
        description: string;
        coverImage: string;
        author: string;
        artist: string;
        status: string;
        genres: string;
        chapterList: string;
        chapterLink: string;
        chapterTitle: string;
        chapterPages: string;
    };
}

export interface ScrapedManhwa {
    title: string;
    slug: string;
    description: string;
    coverImage: string;
    author?: string;
    artist?: string;
    status: string;
    genres: string[];
    chapters: ScrapedChapter[];
    sourceUrl: string;
    sourceName: string;
}

export interface ScrapedChapter {
    number: number;
    title?: string;
    slug: string;
    url: string;
    pages?: string[];
}
