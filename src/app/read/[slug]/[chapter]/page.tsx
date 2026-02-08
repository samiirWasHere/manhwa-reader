import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import ChapterReader from '@/components/reader/ChapterReader';

interface ReadPageProps {
    params: {
        slug: string;
        chapter: string;
    };
}

async function getChapterData(manhwaSlug: string, chapterSlug: string) {
    try {
        const manhwa = await prisma.manhwa.findUnique({
            where: { slug: manhwaSlug },
            select: { id: true, title: true, slug: true },
        });

        if (!manhwa) return null;

        const chapter = await prisma.chapter.findFirst({
            where: {
                manhwaId: manhwa.id,
                slug: chapterSlug,
            },
        });

        if (!chapter) return null;

        // Get all chapters for navigation
        const allChapters = await prisma.chapter.findMany({
            where: { manhwaId: manhwa.id },
            select: {
                id: true,
                slug: true,
                chapterNumber: true,
                title: true,
            },
            orderBy: { chapterNumber: 'asc' },
        });

        // Increment view count (don't fail if it fails)
        await prisma.chapter.update({
            where: { id: chapter.id },
            data: { viewCount: { increment: 1 } },
        }).catch(() => { });

        // Also increment manhwa view count (don't fail if it fails)
        await prisma.manhwa.update({
            where: { id: manhwa.id },
            data: { viewCount: { increment: 1 } },
        }).catch(() => { });

        const currentIndex = allChapters.findIndex((ch: any) => ch.id === chapter.id);
        const prevChapter = currentIndex > 0 ? allChapters[currentIndex - 1] : null;
        const nextChapter = currentIndex < allChapters.length - 1 ? allChapters[currentIndex + 1] : null;

        return {
            manhwa,
            chapter,
            allChapters,
            prevChapter,
            nextChapter,
        };
    } catch (error) {
        console.error('Failed to fetch chapter data:', error);
        return null;
    }
}

export async function generateMetadata({ params }: ReadPageProps) {
    const data = await getChapterData(params.slug, params.chapter);
    if (!data) return { title: 'Chapter Not Found' };

    return {
        title: `${data.manhwa.title} - Chapter ${data.chapter.chapterNumber}`,
        description: `Read ${data.manhwa.title} Chapter ${data.chapter.chapterNumber} online for free.`,
    };
}

export default async function ReadPage({ params }: ReadPageProps) {
    const data = await getChapterData(params.slug, params.chapter);

    if (!data) {
        notFound();
    }

    return (
        <ChapterReader
            manhwa={data.manhwa}
            chapter={data.chapter}
            allChapters={data.allChapters}
            prevChapter={data.prevChapter}
            nextChapter={data.nextChapter}
        />
    );
}
