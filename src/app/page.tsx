import { Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { prisma } from '@/lib/db';
import { Eye, TrendingUp, Clock, ChevronRight, Star, Bookmark } from 'lucide-react';
import ManhwaCard from '@/components/ui/ManhwaCard';
import { formatNumber, getStatusColor, getTypeColor } from '@/lib/utils';
import { cn } from '@/lib/utils';

export const dynamic = 'force-dynamic';

async function getHomeData() {
    try {
        const [
            featuredManhwa,
            trendingManhwa,
            latestUpdates,
            popularManhwa,
            genres,
        ] = await Promise.all([
            prisma.manhwa.findMany({
                where: { rating: { gte: 4.0 } },
                include: { genres: true, _count: { select: { chapters: true } } },
                orderBy: { viewCount: 'desc' },
                take: 4,
            }),
            prisma.manhwa.findMany({
                include: { genres: true, _count: { select: { chapters: true } } },
                orderBy: { viewCount: 'desc' },
                take: 10,
            }),
            prisma.manhwa.findMany({
                include: {
                    genres: true,
                    chapters: { orderBy: { createdAt: 'desc' }, take: 3 },
                    _count: { select: { chapters: true } },
                },
                orderBy: { updatedAt: 'desc' },
                take: 15,
            }),
            prisma.manhwa.findMany({
                include: { genres: true, _count: { select: { chapters: true } } },
                orderBy: { bookmarkCount: 'desc' },
                take: 10,
            }),
            prisma.genre.findMany({
                include: { _count: { select: { manhwas: true } } },
                orderBy: { name: 'asc' },
            }),
        ]);

        return { featuredManhwa, trendingManhwa, latestUpdates, popularManhwa, genres };
    } catch (error) {
        console.error('Failed to fetch home data:', error);
        return {
            featuredManhwa: [],
            trendingManhwa: [],
            latestUpdates: [],
            popularManhwa: [],
            genres: []
        };
    }
}

export default async function HomePage() {
    const data = await getHomeData();
    const heroManhwa = data.featuredManhwa[0];

    return (
        <>
            {/* Hero Section */}
            {heroManhwa && (
                <section className="relative h-[500px] overflow-hidden -mt-16">
                    {/* Background */}
                    <div className="absolute inset-0">
                        <Image
                            src={heroManhwa.bannerImage || heroManhwa.coverImage}
                            alt=""
                            fill
                            className="object-cover"
                            priority
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-secondary via-secondary/95 to-transparent" />
                        <div className="absolute inset-0 bg-gradient-to-t from-secondary via-transparent to-transparent" />
                    </div>

                    <div className="container-custom relative z-10 h-full flex items-center pt-16">
                        <div className="max-w-2xl">
                            <div className="flex items-center gap-2 mb-3">
                                <span className={cn('badge', getTypeColor(heroManhwa.type))}>
                                    {heroManhwa.type}
                                </span>
                                <span className={cn('badge', getStatusColor(heroManhwa.status))}>
                                    {heroManhwa.status}
                                </span>
                                {heroManhwa.rating && (
                                    <span className="flex items-center gap-1 text-yellow-400 text-sm">
                                        <Star className="w-4 h-4 fill-current" />
                                        {heroManhwa.rating.toFixed(1)}
                                    </span>
                                )}
                            </div>

                            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
                                {heroManhwa.title}
                            </h1>

                            <p className="text-text-secondary text-lg mb-6 line-clamp-3">
                                {heroManhwa.description}
                            </p>

                            <div className="flex flex-wrap gap-2 mb-6">
                                {heroManhwa.genres.slice(0, 4).map((genre: any) => (
                                    <Link
                                        key={genre.id}
                                        href={`/manhwa?genres=${genre.slug}`}
                                        className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded-full text-sm text-white transition-colors"
                                    >
                                        {genre.name}
                                    </Link>
                                ))}
                            </div>

                            <div className="flex items-center gap-4">
                                <Link
                                    href={`/manhwa/${heroManhwa.slug}`}
                                    className="btn-primary text-lg px-8"
                                >
                                    Read Now
                                </Link>
                                <div className="flex items-center gap-4 text-text-secondary text-sm">
                                    <span className="flex items-center gap-1">
                                        <Eye className="w-4 h-4" />
                                        {formatNumber(heroManhwa.viewCount)} views
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Bookmark className="w-4 h-4" />
                                        {formatNumber(heroManhwa.bookmarkCount)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            <div className="container-custom py-10">
                {/* Featured Grid */}
                <section className="mb-12">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                            <Star className="w-6 h-6 text-yellow-400" />
                            Featured
                        </h2>
                        <Link
                            href="/manhwa?sort=rating"
                            className="text-primary hover:underline flex items-center gap-1"
                        >
                            View All <ChevronRight className="w-4 h-4" />
                        </Link>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {data.featuredManhwa.map((manhwa: any) => (
                            <ManhwaCard key={manhwa.id} manhwa={manhwa} variant="featured" />
                        ))}
                    </div>
                </section>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-12">
                        {/* Trending */}
                        <section>
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                                    <TrendingUp className="w-6 h-6 text-primary" />
                                    Trending
                                </h2>
                                <Link
                                    href="/manhwa?sort=popular"
                                    className="text-primary hover:underline flex items-center gap-1"
                                >
                                    View All <ChevronRight className="w-4 h-4" />
                                </Link>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                {data.trendingManhwa.map((manhwa: any, index: number) => (
                                    <ManhwaCard
                                        key={manhwa.id}
                                        manhwa={manhwa}
                                        variant="compact"
                                        index={index}
                                        showRank
                                    />
                                ))}
                            </div>
                        </section>

                        {/* Latest Updates */}
                        <section>
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                                    <Clock className="w-6 h-6 text-green-400" />
                                    Latest Updates
                                </h2>
                                <Link
                                    href="/manhwa?sort=latest"
                                    className="text-primary hover:underline flex items-center gap-1"
                                >
                                    View All <ChevronRight className="w-4 h-4" />
                                </Link>
                            </div>
                            <div className="space-y-3">
                                {data.latestUpdates.map((manhwa: any) => (
                                    <ManhwaCard key={manhwa.id} manhwa={manhwa} variant="list" />
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* Sidebar */}
                    <aside className="space-y-8">
                        {/* Popular Rankings */}
                        <div className="card p-5">
                            <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                                <Bookmark className="w-5 h-5 text-pink-400" />
                                Most Bookmarked
                            </h3>
                            <div className="space-y-3">
                                {data.popularManhwa.slice(0, 5).map((manhwa: any, index: number) => (
                                    <Link
                                        key={manhwa.id}
                                        href={`/manhwa/${manhwa.slug}`}
                                        className="flex items-center gap-3 group"
                                    >
                                        <span className={cn(
                                            'w-7 h-7 rounded-lg flex items-center justify-center text-sm font-bold',
                                            index === 0 ? 'bg-yellow-500/20 text-yellow-400' :
                                                index === 1 ? 'bg-gray-400/20 text-gray-400' :
                                                    index === 2 ? 'bg-orange-500/20 text-orange-400' :
                                                        'bg-surface text-text-muted'
                                        )}>
                                            {index + 1}
                                        </span>
                                        <div className="relative w-10 h-14 rounded overflow-hidden shrink-0">
                                            <Image
                                                src={manhwa.coverImage}
                                                alt=""
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-white truncate group-hover:text-primary transition-colors">
                                                {manhwa.title}
                                            </p>
                                            <p className="text-xs text-text-muted">
                                                {formatNumber(manhwa.bookmarkCount)} bookmarks
                                            </p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Genres */}
                        <div className="card p-5">
                            <h3 className="font-bold text-white mb-4">Browse Genres</h3>
                            <div className="flex flex-wrap gap-2">
                                {data.genres.map((genre: any) => (
                                    <Link
                                        key={genre.id}
                                        href={`/manhwa?genres=${genre.slug}`}
                                        className="px-3 py-1.5 bg-surface hover:bg-surface-hover border border-surface-border rounded-full text-sm text-text-secondary hover:text-white transition-all"
                                    >
                                        {genre.name}
                                        <span className="ml-1 text-text-muted">
                                            ({genre._count.manhwas})
                                        </span>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </>
    );
}
