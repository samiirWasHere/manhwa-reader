import { BaseScraper, ScrapedManhwaData, ScrapedPageData } from '../base';

export class GenericScraper extends BaseScraper {
    constructor() {
        super('Generic', '');
    }

    // Common selectors patterns for manga/manhwa sites
    private commonPatterns = {
        title: [
            '.entry-title',
            '.post-title h1',
            '.manga-title',
            '.series-title',
            'h1.title',
            '.comic-title',
            '.info-title',
        ],
        description: [
            '.summary__content',
            '.entry-content',
            '.description',
            '.synopsis',
            '.manga-summary',
            '.series-summary',
            '.comic-description',
        ],
        coverImage: [
            '.summary_image img',
            '.thumb img',
            '.manga-thumb img',
            '.cover img',
            '.poster img',
            '.series-thumb img',
        ],
        author: [
            '.author-content a',
            '.manga-authors a',
            '.author a',
            '.artist a',
        ],
        status: [
            '.summary-content:contains("Status")',
            '.status',
            '.post-status',
        ],
        genres: [
            '.genres-content a',
            '.genre a',
            '.tags a',
            '.manga-genres a',
        ],
        chapters: [
            '.wp-manga-chapter a',
            '.chapter-list a',
            '.chapters-list a',
            '.eplister a',
            '.eplisterfull a',
        ],
        pages: [
            '.reading-content img',
            '.chapter-content img',
            '.reader-content img',
            '#readerarea img',
            '.chapter-images img',
        ],
    };

    async scrapeManhwaInfo(url: string): Promise<ScrapedManhwaData> {
        const $ = await this.fetchPage(url);

        // Try to find title
        let title = '';
        for (const selector of this.commonPatterns.title) {
            const found = $(selector).first().text().trim();
            if (found) {
                title = found;
                break;
            }
        }

        if (!title) {
            title = $('title').text().split('|')[0].split('-')[0].trim();
        }

        // Try to find description
        let description = '';
        for (const selector of this.commonPatterns.description) {
            const found = $(selector).first().text().trim();
            if (found) {
                description = found;
                break;
            }
        }

        // Try to find cover image
        let coverImage = '';
        for (const selector of this.commonPatterns.coverImage) {
            const found = $(selector).first().attr('src') || $(selector).first().attr('data-src');
            if (found) {
                coverImage = found.startsWith('http') ? found : new URL(found, url).href;
                break;
            }
        }

        // Try to find author
        let author = '';
        for (const selector of this.commonPatterns.author) {
            const found = $(selector).first().text().trim();
            if (found) {
                author = found;
                break;
            }
        }

        // Try to find genres
        const genres: string[] = [];
        for (const selector of this.commonPatterns.genres) {
            $(selector).each((_, el) => {
                const genre = $(el).text().trim();
                if (genre && !genres.includes(genre)) {
                    genres.push(genre);
                }
            });
            if (genres.length > 0) break;
        }

        // Try to find status
        let status: 'ONGOING' | 'COMPLETED' | 'HIATUS' = 'ONGOING';
        const pageText = $.text().toLowerCase();
        if (pageText.includes('completed') || pageText.includes('finished')) {
            status = 'COMPLETED';
        } else if (pageText.includes('hiatus')) {
            status = 'HIATUS';
        }

        // Determine type
        let type: 'MANHWA' | 'MANGA' | 'MANHUA' | 'WEBTOON' = 'MANHWA';
        if (pageText.includes('manga') || pageText.includes('japanese')) {
            type = 'MANGA';
        } else if (pageText.includes('manhua') || pageText.includes('chinese')) {
            type = 'MANHUA';
        } else if (pageText.includes('webtoon')) {
            type = 'WEBTOON';
        }

        // Try to find chapters
        const chapters: { number: number; title?: string; url: string }[] = [];

        for (const selector of this.commonPatterns.chapters) {
            $(selector).each((_, el) => {
                const href = $(el).attr('href');
                const text = $(el).text().trim();

                if (href) {
                    // Extract chapter number from text or URL
                    const numMatch = text.match(/(\d+(?:\.\d+)?)/);
                    const urlMatch = href.match(/chapter[_-]?(\d+(?:\.\d+)?)/i);

                    const num = numMatch ? parseFloat(numMatch[1]) :
                        urlMatch ? parseFloat(urlMatch[1]) : null;

                    if (num !== null) {
                        chapters.push({
                            number: num,
                            title: text,
                            url: href.startsWith('http') ? href : new URL(href, url).href,
                        });
                    }
                }
            });

            if (chapters.length > 0) break;
        }

        // Sort chapters by number and remove duplicates
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
            status,
            type,
            genres,
            chapters: uniqueChapters,
        };
    }

    async scrapeChapterPages(url: string): Promise<ScrapedPageData> {
        const $ = await this.fetchPage(url);
        const pages: string[] = [];

        for (const selector of this.commonPatterns.pages) {
            $(selector).each((_, el) => {
                const src = $(el).attr('src') || $(el).attr('data-src') || $(el).attr('data-lazy-src');
                if (src) {
                    const fullUrl = src.startsWith('http') ? src : new URL(src, url).href;
                    if (!pages.includes(fullUrl)) {
                        pages.push(fullUrl);
                    }
                }
            });

            if (pages.length > 0) break;
        }

        return { pages };
    }
}
