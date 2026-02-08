import * as cheerio from 'cheerio';
import { prisma } from '@/lib/db';
import { slugify } from '@/lib/utils';
import { downloadImage } from './imageDownloader';

export interface ScrapedManhwaData {
    title: string;
    description: string;
    coverImage: string;
    bannerImage?: string;
    author?: string;
    artist?: string;
    status: 'ONGOING' | 'COMPLETED' | 'HIATUS';
    type: 'MANHWA' | 'MANGA' | 'MANHUA' | 'WEBTOON';
    genres: string[];
    chapters: ScrapedChapterData[];
}

export interface ScrapedChapterData {
    number: number;
    title?: string;
    url: string;
}

export interface ScrapedPageData {
    pages: string[];
}

export abstract class BaseScraper {
    protected baseUrl: string;
    protected name: string;
    protected headers: Record<string, string>;

    constructor(name: string, baseUrl: string) {
        this.name = name;
        this.baseUrl = baseUrl;
        this.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'Referer': baseUrl,
        };
    }

    protected async fetchPage(url: string): Promise<cheerio.CheerioAPI> {
        const response = await fetch(url, { headers: this.headers });
        if (!response.ok) {
            throw new Error(`Failed to fetch ${url}: ${response.status}`);
        }
        const html = await response.text();
        return cheerio.load(html);
    }

    protected delay(ms: number): Promise<void> {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    abstract scrapeManhwaInfo(url: string): Promise<ScrapedManhwaData>;
    abstract scrapeChapterPages(url: string): Promise<ScrapedPageData>;

    async scrapeAndSave(jobId: string, url: string): Promise<void> {
        try {
            // Update job status
            await prisma.scraperJob.update({
                where: { id: jobId },
                data: { status: 'RUNNING', startedAt: new Date() },
            });

            // Scrape manhwa info
            console.log(`[Scraper] Starting to scrape: ${url}`);
            const manhwaData = await this.scrapeManhwaInfo(url);

            // Generate slug
            const slug = slugify(manhwaData.title);

            // Check if manhwa already exists
            let manhwa = await prisma.manhwa.findUnique({
                where: { slug },
            });

            // Download and save cover image
            let coverImagePath = manhwaData.coverImage;
            try {
                coverImagePath = await downloadImage(manhwaData.coverImage, slug, 'cover');
            } catch (err) {
                console.error('Failed to download cover:', err);
            }

            // Get or create genres
            const genreConnections = [];
            for (const genreName of manhwaData.genres) {
                const genreSlug = slugify(genreName);
                const genre = await prisma.genre.upsert({
                    where: { slug: genreSlug },
                    update: {},
                    create: { name: genreName, slug: genreSlug },
                });
                genreConnections.push({ id: genre.id });
            }

            if (manhwa) {
                // Update existing manhwa
                manhwa = await prisma.manhwa.update({
                    where: { id: manhwa.id },
                    data: {
                        description: manhwaData.description,
                        coverImage: coverImagePath,
                        author: manhwaData.author,
                        artist: manhwaData.artist,
                        status: manhwaData.status,
                        type: manhwaData.type,
                        sourceUrl: url,
                        sourceName: this.name,
                        genres: { set: genreConnections },
                    },
                });
            } else {
                // Create new manhwa
                manhwa = await prisma.manhwa.create({
                    data: {
                        title: manhwaData.title,
                        slug,
                        description: manhwaData.description,
                        coverImage: coverImagePath,
                        author: manhwaData.author,
                        artist: manhwaData.artist,
                        status: manhwaData.status,
                        type: manhwaData.type,
                        sourceUrl: url,
                        sourceName: this.name,
                        genres: { connect: genreConnections },
                    },
                });
            }

            console.log(`[Scraper] Created/updated manhwa: ${manhwa.title}`);

            // Scrape chapters
            for (const chapterData of manhwaData.chapters) {
                const chapterSlug = `chapter-${chapterData.number}`;

                // Check if chapter already exists
                const existingChapter = await prisma.chapter.findFirst({
                    where: { manhwaId: manhwa.id, chapterNumber: chapterData.number },
                });

                if (!existingChapter) {
                    // Scrape chapter pages
                    await this.delay(1000); // Rate limiting

                    try {
                        const pageData = await this.scrapeChapterPages(chapterData.url);

                        // Download and save pages
                        const savedPages: string[] = [];
                        for (let i = 0; i < pageData.pages.length; i++) {
                            try {
                                const pagePath = await downloadImage(
                                    pageData.pages[i],
                                    slug,
                                    `ch-${chapterData.number}/${i + 1}`
                                );
                                savedPages.push(pagePath);
                            } catch (err) {
                                console.error(`Failed to download page ${i}:`, err);
                                savedPages.push(pageData.pages[i]); // Keep original URL as fallback
                            }
                        }

                        await prisma.chapter.create({
                            data: {
                                manhwaId: manhwa.id,
                                chapterNumber: chapterData.number,
                                title: chapterData.title,
                                slug: chapterSlug,
                                pages: JSON.stringify(savedPages),
                                pageCount: savedPages.length,
                            },
                        });

                        console.log(`[Scraper] Created chapter ${chapterData.number}`);
                    } catch (err) {
                        console.error(`Failed to scrape chapter ${chapterData.number}:`, err);
                    }
                }
            }

            // Update job status
            await prisma.scraperJob.update({
                where: { id: jobId },
                data: {
                    status: 'COMPLETED',
                    completedAt: new Date(),
                    manhwaId: manhwa.id,
                },
            });

            console.log(`[Scraper] Completed scraping: ${manhwa.title}`);
        } catch (error) {
            console.error(`[Scraper] Error:`, error);

            await prisma.scraperJob.update({
                where: { id: jobId },
                data: {
                    status: 'FAILED',
                    error: error instanceof Error ? error.message : 'Unknown error',
                    completedAt: new Date(),
                },
            });

            throw error;
        }
    }
}
