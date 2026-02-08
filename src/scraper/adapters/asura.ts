import { BaseScraper, ScrapedManhwaData, ScrapedPageData } from '../base';

export class AsuraScraper extends BaseScraper {
    constructor() {
        super('AsuraScans', 'https://asuracomic.net');
    }

    async scrapeManhwaInfo(url: string): Promise<ScrapedManhwaData> {
        const $ = await this.fetchPage(url);

        // Extract title
        const title = $('.entry-title').text().trim() ||
            $('h1').first().text().trim();

        // Extract description
        const description = $('.entry-content p').text().trim() ||
            $('.summary__content').text().trim();

        // Extract cover image
        const coverImage = $('.thumb img').attr('src') ||
            $('.summary_image img').attr('src') || '';

        // Extract author and artist
        const author = $('.author-content a').text().trim();
        const artist = $('.artist-content a').text().trim();

        // Extract status
        let status: 'ONGOING' | 'COMPLETED' | 'HIATUS' = 'ONGOING';
        const statusText = $('.post-status .summary-content').text().toLowerCase();
        if (statusText.includes('completed')) {
            status = 'COMPLETED';
        } else if (statusText.includes('hiatus')) {
            status = 'HIATUS';
        }

        // Extract genres
        const genres: string[] = [];
        $('.genres-content a').each((_, el) => {
            genres.push($(el).text().trim());
        });

        // Extract chapters
        const chapters: { number: number; title?: string; url: string }[] = [];
        $('.eplister li a, .wp-manga-chapter a').each((_, el) => {
            const href = $(el).attr('href');
            const chapterText = $(el).text().trim();

            if (href) {
                const numMatch = chapterText.match(/(\d+(?:\.\d+)?)/);
                const num = numMatch ? parseFloat(numMatch[1]) : null;

                if (num !== null) {
                    chapters.push({
                        number: num,
                        title: chapterText,
                        url: href.startsWith('http') ? href : new URL(href, this.baseUrl).href,
                    });
                }
            }
        });

        // Sort and deduplicate
        const uniqueChapters = chapters
            .filter((ch, index, self) =>
                index === self.findIndex(t => t.number === ch.number)
            )
            .sort((a, b) => a.number - b.number);

        return {
            title,
            description,
            coverImage,
            author,
            artist,
            status,
            type: 'MANHWA',
            genres,
            chapters: uniqueChapters,
        };
    }

    async scrapeChapterPages(url: string): Promise<ScrapedPageData> {
        const $ = await this.fetchPage(url);
        const pages: string[] = [];

        // Try different selectors for images
        $('#readerarea img, .reading-content img, .chapter-content img').each((_, el) => {
            const src = $(el).attr('src') || $(el).attr('data-src');
            if (src && !src.includes('logo') && !src.includes('banner')) {
                pages.push(src);
            }
        });

        return { pages };
    }
}
