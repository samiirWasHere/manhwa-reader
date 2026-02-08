import { BaseScraper } from './base';
import { GenericScraper } from './adapters/generic';
import { AsuraScraper } from './adapters/asura';

// Map of source names to scraper instances
const scrapers: Record<string, () => BaseScraper> = {
    generic: () => new GenericScraper(),
    asura: () => new AsuraScraper(),
    // Add more scrapers here as needed
};

export function getScraper(sourceName: string): BaseScraper {
    const scraperFactory = scrapers[sourceName.toLowerCase()];
    if (scraperFactory) {
        return scraperFactory();
    }
    // Default to generic scraper
    return new GenericScraper();
}

export async function scrapeFromUrl(
    jobId: string,
    url: string,
    sourceName?: string
): Promise<void> {
    // Auto-detect source from URL if not provided
    let source = sourceName || 'generic';

    if (!sourceName || sourceName === 'generic') {
        if (url.includes('asura')) {
            source = 'asura';
        } else if (url.includes('reaper')) {
            source = 'reaper';
        } else if (url.includes('flame')) {
            source = 'flame';
        }
    }

    const scraper = getScraper(source);
    await scraper.scrapeAndSave(jobId, url);
}

// Re-export types
export type { ScrapedManhwaData, ScrapedChapterData, ScrapedPageData } from './base';
export { BaseScraper } from './base';
