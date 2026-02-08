import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { prisma } from '@/lib/db';
import {
    Star,
    Eye,
    BookOpen,
    Clock,
    User,
    Palette,
    Heart,
    Share2,
    Bookmark,
    ChevronRight
} from 'lucide-react';
import { formatNumber, formatDate, getStatusColor, getTypeColor } from '@/lib/utils';
import { cn } from '@/lib/utils';
import BookmarkButton from '@/components/manhwa/BookmarkButton';
import ChapterList from '@/components/manhwa/ChapterList';

interface ManhwaPageProps {
    params: { slug: string };
}

async function getManhwa(slug: string) {
    const manhwa = await prisma.manhwa.findUnique({
        where: { slug },
        include: {
            genres: true,
            chapters: {
                orderBy: { chapterNumber: 'desc' },
            },
            _count: {
                select: {
                    chapters: true,
                    bookmarks: true,
                    comments: true,
                },
            },
        },
    });

    if (!manhwa) return null;

    // Increment view count
    await prisma.manhwa.update({
        where: { id: manhwa.id },
        data: { viewCount: { increment: 1 } },
    });

    return manhwa;
}

async function getRelatedManhwa(genres: { id: string }[], excludeId: string) {
    return prisma.manhwa.findMany({
        where: {
            id: { not: excludeId },
            genres: { some: { id: { in: genres.map(g => g.id) } } },
        },
        include: {
            genres: true,
            _count: { select: { chapters: true } },
        },
        take: 6,
        orderBy: { viewCount: 'desc' },
    });
}

export async function generateMetadata({ params }: ManhwaPageProps) {
    const manhwa = await getManhwa(params.slug);
    if (!manhwa) return { title: 'Not Found' };

    return {
        title: manhwa.title,
        description: manhwa.description.slice(0, 160),
        openGraph: {
            title: manhwa.title,
            description: manhwa.description.slice(0, 160),
            images: [manhwa.coverImage],
        },
    };
}

export default async function ManhwaPage({ params }: ManhwaPageProps) {
    const manhwa = await getManhwa(params.slug);

    if (!manhwa) {
        notFound();
    }

    const related = await getRelatedManhwa(manhwa.genres, manhwa.id);
    const firstChapter = manhwa.chapters.length > 0
        ? manhwa.chapters[manhwa.chapters.length - 1]
        : null;
    const latestChapter = manhwa.chapters.length > 0
        ? manhwa.chapters[0]
        : null;

    return (
        <div className="min-h-screen">
            {/* Hero Banner */}
            <div className="relative h-[300px] md:h-[400px] overflow-hidden">
                <Image
                    src={manhwa.bannerImage || manhwa.coverImage}
                    alt={manhwa.title}
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-background/60 to-transparent" />
            </div>

            {/* Main Content */}
            <div className="container-custom relative -mt-48 md:-mt-64 pb-12">
                <div className="flex flex-col md:flex-row gap-6 md:gap-8">
                    {/* Cover Image */}
                    <div className="shrink-0 mx-auto md:mx-0">
                        <div className="relative w-[180px] h-[260px] md:w-[220px] md:h-[320px] rounded-xl overflow-hidden shadow-2xl ring-4 ring-background">
                            <Image
                                src={manhwa.coverImage}
                                alt={manhwa.title}
                                fill
                                className="object-cover"
                                priority
                            />
                        </div>
                    </div>

                    {/* Info */}
                    <div className="flex-1 text-center md:text-left">
                        {/* Badges */}
                        <div className="flex items-center justify-center md:justify-start gap-2 mb-3 flex-wrap">
                            <span className={cn('badge', getTypeColor(manhwa.type))}>
                                {manhwa.type}
                            </span>
                            <span className={cn('badge', getStatusColor(manhwa.status))}>
                                {manhwa.status}
                            </span>
                            {manhwa.isHot && (
                                <span className="badge-hot">🔥 HOT</span>
                            )}
                        </div>

                        {/* Title */}
                        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                            {manhwa.title}
                        </h1>

                        {/* Stats */}
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 md:gap-6 mb-6 text-sm">
                            <div className="flex items-center gap-1.5">
                                <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                                <span className="text-white font-semibold text-lg">{manhwa.rating.toFixed(1)}</span>
                                <span className="text-text-muted">({formatNumber(manhwa.ratingCount)})</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-text-secondary">
                                <Eye className="w-5 h-5" />
                                <span>{formatNumber(manhwa.viewCount)} views</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-text-secondary">
                                <BookOpen className="w-5 h-5" />
                                <span>{manhwa._count.chapters} chapters</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-text-secondary">
                                <Heart className="w-5 h-5" />
                                <span>{formatNumber(manhwa._count.bookmarks)} bookmarks</span>
                            </div>
                        </div>

                        {/* Meta Info */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 text-sm">
                            {manhwa.author && (
                                <div className="flex items-center gap-2 text-text-secondary">
                                    <User className="w-4 h-4 shrink-0" />
                                    <span className="truncate">{manhwa.author}</span>
                                </div>
                            )}
                            {manhwa.artist && (
                                <div className="flex items-center gap-2 text-text-secondary">
                                    <Palette className="w-4 h-4 shrink-0" />
                                    <span className="truncate">{manhwa.artist}</span>
                                </div>
                            )}
                            {manhwa.releaseYear && (
                                <div className="flex items-center gap-2 text-text-secondary">
                                    <Clock className="w-4 h-4 shrink-0" />
                                    <span>{manhwa.releaseYear}</span>
                                </div>
                            )}
                            <div className="flex items-center gap-2 text-text-secondary">
                                <Clock className="w-4 h-4 shrink-0" />
                                <span>Updated {formatDate(manhwa.updatedAt)}</span>
                            </div>
                        </div>

                        {/* Genres */}
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-6">
                            {manhwa.genres.map((genre: any) => (
                                <Link
                                    key={genre.id}
                                    href={`/genre/${genre.slug}`}
                                    className="px-3 py-1.5 rounded-full bg-surface hover:bg-surface-hover border border-surface-border text-sm text-text-secondary hover:text-white transition-all"
                                >
                                    {genre.name}
                                </Link>
                            ))}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                            {firstChapter && (
                                <Link
                                    href={`/read/${manhwa.slug}/${firstChapter.slug}`}
                                    className="btn-primary flex items-center gap-2"
                                >
                                    <BookOpen className="w-4 h-4" />
                                    Start Reading
                                </Link>
                            )}
                            {latestChapter && latestChapter !== firstChapter && (
                                <Link
                                    href={`/read/${manhwa.slug}/${latestChapter.slug}`}
                                    className="btn-secondary flex items-center gap-2"
                                >
                                    Continue Ch. {latestChapter.chapterNumber}
                                </Link>
                            )}
                            <BookmarkButton manhwaId={manhwa.id} />
                            <button className="btn-ghost p-3">
                                <Share2 className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Description & Chapters */}
                <div className="mt-12 grid lg:grid-cols-3 gap-8">
                    {/* Main Column */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Synopsis */}
                        <section className="card p-6">
                            <h2 className="text-xl font-semibold text-white mb-4">Synopsis</h2>
                            <p className="text-text-secondary leading-relaxed whitespace-pre-line">
                                {manhwa.description}
                            </p>
                        </section>

                        {/* Chapter List */}
                        <section className="card p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-semibold text-white">
                                    Chapters ({manhwa._count.chapters})
                                </h2>
                            </div>
                            <ChapterList chapters={manhwa.chapters} manhwaSlug={manhwa.slug} />
                        </section>
                    </div>

                    {/* Sidebar */}
                    <aside className="space-y-6">
                        {/* Related Manhwa */}
                        {related.length > 0 && (
                            <div className="card p-4">
                                <h3 className="font-semibold text-white mb-4">You May Also Like</h3>
                                <div className="space-y-3">
                                    {related.map((item: any) => (
                                        <Link
                                            key={item.id}
                                            href={`/manhwa/${item.slug}`}
                                            className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors group"
                                        >
                                            <div className="relative w-12 h-16 rounded-lg overflow-hidden shrink-0">
                                                <Image
                                                    src={item.coverImage}
                                                    alt={item.title}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-medium text-white truncate group-hover:text-primary transition-colors">
                                                    {item.title}
                                                </h4>
                                                <p className="text-xs text-text-muted">
                                                    {item._count.chapters} chapters
                                                </p>
                                            </div>
                                            <ChevronRight className="w-4 h-4 text-text-muted group-hover:text-primary transition-colors" />
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                    </aside>
                </div>
            </div>
        </div>
    );
}
