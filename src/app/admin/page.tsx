import { prisma } from '@/lib/db';
import {
    BookOpen,
    Users,
    Eye,
    Download,
    TrendingUp,
    Clock,
    Layers,
    Heart
} from 'lucide-react';
import { formatNumber } from '@/lib/utils';

export const dynamic = 'force-dynamic';

async function getStats() {
    try {
        const [
            totalManhwa,
            totalChapters,
            totalUsers,
            totalViews,
            recentManhwa,
            recentScraperJobs,
        ] = await Promise.all([
            prisma.manhwa.count(),
            prisma.chapter.count(),
            prisma.user.count(),
            prisma.manhwa.aggregate({ _sum: { viewCount: true } }),
            prisma.manhwa.findMany({
                orderBy: { createdAt: 'desc' },
                take: 5,
                select: { id: true, title: true, slug: true, coverImage: true, createdAt: true },
            }),
            prisma.scraperJob.findMany({
                orderBy: { createdAt: 'desc' },
                take: 5,
            }),
        ]);

        return {
            totalManhwa,
            totalChapters,
            totalUsers,
            totalViews: totalViews._sum.viewCount || 0,
            recentManhwa,
            recentScraperJobs,
        };
    } catch (error) {
        console.error('Failed to fetch admin stats:', error);
        return {
            totalManhwa: 0,
            totalChapters: 0,
            totalUsers: 0,
            totalViews: 0,
            recentManhwa: [],
            recentScraperJobs: [],
        };
    }
}

export default async function AdminDashboard() {
    const stats = await getStats();

    const statCards = [
        {
            label: 'Total Manhwa',
            value: stats.totalManhwa,
            icon: BookOpen,
            color: 'from-purple-500 to-pink-500',
        },
        {
            label: 'Total Chapters',
            value: stats.totalChapters,
            icon: Layers,
            color: 'from-blue-500 to-cyan-500',
        },
        {
            label: 'Total Users',
            value: stats.totalUsers,
            icon: Users,
            color: 'from-green-500 to-emerald-500',
        },
        {
            label: 'Total Views',
            value: stats.totalViews,
            icon: Eye,
            color: 'from-orange-500 to-red-500',
        },
    ];

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-white">Dashboard</h1>
                <p className="text-text-secondary mt-1">Welcome back! Here&apos;s an overview of your platform.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {statCards.map((stat) => (
                    <div key={stat.label} className="card p-5">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-text-muted text-sm">{stat.label}</p>
                                <p className="text-2xl font-bold text-white mt-1">
                                    {formatNumber(stat.value)}
                                </p>
                            </div>
                            <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                                <stat.icon className="w-5 h-5 text-white" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
                {/* Recent Manhwa */}
                <div className="card p-5">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="font-semibold text-white flex items-center gap-2">
                            <Clock className="w-4 h-4 text-primary" />
                            Recently Added
                        </h2>
                        <a href="/admin/manhwa" className="text-sm text-primary hover:underline">
                            View All
                        </a>
                    </div>
                    <div className="space-y-3">
                        {stats.recentManhwa.map((manhwa: any) => (
                            <div key={manhwa.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors">
                                <div className="w-10 h-14 rounded-lg bg-surface overflow-hidden shrink-0">
                                    <img
                                        src={manhwa.coverImage}
                                        alt=""
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-white truncate">{manhwa.title}</p>
                                    <p className="text-xs text-text-muted">
                                        {new Date(manhwa.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Scraper Jobs */}
                <div className="card p-5">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="font-semibold text-white flex items-center gap-2">
                            <Download className="w-4 h-4 text-primary" />
                            Scraper Activity
                        </h2>
                        <a href="/admin/scraper" className="text-sm text-primary hover:underline">
                            View All
                        </a>
                    </div>
                    <div className="space-y-3">
                        {stats.recentScraperJobs.length > 0 ? (
                            stats.recentScraperJobs.map((job: any) => (
                                <div key={job.id} className="flex items-center justify-between p-3 rounded-lg bg-surface/50">
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-white text-sm truncate">{job.sourceName}</p>
                                        <p className="text-xs text-text-muted truncate">{job.sourceUrl}</p>
                                    </div>
                                    <span className={`badge ${job.status === 'COMPLETED' ? 'text-green-400 bg-green-400/10' :
                                        job.status === 'RUNNING' ? 'text-blue-400 bg-blue-400/10' :
                                            job.status === 'FAILED' ? 'text-red-400 bg-red-400/10' :
                                                'text-yellow-400 bg-yellow-400/10'
                                        }`}>
                                        {job.status}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <p className="text-text-muted text-sm text-center py-4">No scraper jobs yet</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-8">
                <h2 className="font-semibold text-white mb-4">Quick Actions</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <a
                        href="/admin/manhwa/new"
                        className="card p-4 text-center hover:bg-surface-hover transition-colors group"
                    >
                        <BookOpen className="w-8 h-8 text-primary mx-auto mb-2 group-hover:scale-110 transition-transform" />
                        <p className="text-sm text-white">Add Manhwa</p>
                    </a>
                    <a
                        href="/admin/scraper"
                        className="card p-4 text-center hover:bg-surface-hover transition-colors group"
                    >
                        <Download className="w-8 h-8 text-primary mx-auto mb-2 group-hover:scale-110 transition-transform" />
                        <p className="text-sm text-white">Start Scraper</p>
                    </a>
                    <a
                        href="/admin/users"
                        className="card p-4 text-center hover:bg-surface-hover transition-colors group"
                    >
                        <Users className="w-8 h-8 text-primary mx-auto mb-2 group-hover:scale-110 transition-transform" />
                        <p className="text-sm text-white">Manage Users</p>
                    </a>
                    <a
                        href="/admin/analytics"
                        className="card p-4 text-center hover:bg-surface-hover transition-colors group"
                    >
                        <TrendingUp className="w-8 h-8 text-primary mx-auto mb-2 group-hover:scale-110 transition-transform" />
                        <p className="text-sm text-white">View Analytics</p>
                    </a>
                </div>
            </div>
        </div>
    );
}
