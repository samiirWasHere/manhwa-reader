'use client';

import { useState } from 'react';
import useSWR from 'swr';
import {
    Plus,
    Search,
    Filter,
    Edit,
    Trash2,
    Eye,
    MoreVertical,
    Loader2
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { formatNumber, formatDate, getStatusColor, getTypeColor } from '@/lib/utils';
import { cn } from '@/lib/utils';
import Pagination from '@/components/ui/Pagination';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function AdminManhwaPage() {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [searchInput, setSearchInput] = useState('');

    const { data, isLoading, mutate } = useSWR(
        `/api/manhwa?page=${page}&limit=15&search=${search}`,
        fetcher
    );

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setSearch(searchInput);
        setPage(1);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this manhwa?')) return;

        try {
            await fetch(`/api/admin/manhwa/${id}`, { method: 'DELETE' });
            mutate();
        } catch (error) {
            console.error('Delete error:', error);
        }
    };

    return (
        <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-white">Manhwa Management</h1>
                    <p className="text-text-secondary mt-1">Manage your manhwa library</p>
                </div>
                <Link href="/admin/manhwa/new" className="btn-primary inline-flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Add Manhwa
                </Link>
            </div>

            {/* Search and Filters */}
            <div className="card p-4 mb-6">
                <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                        <input
                            type="text"
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            placeholder="Search by title, author..."
                            className="input-field pl-10"
                        />
                    </div>
                    <button type="submit" className="btn-secondary inline-flex items-center gap-2">
                        <Filter className="w-4 h-4" />
                        Search
                    </button>
                </form>
            </div>

            {/* Manhwa Table */}
            <div className="card overflow-hidden">
                {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                ) : data?.data?.data?.length > 0 ? (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-surface border-b border-surface-border">
                                    <tr>
                                        <th className="text-left text-xs font-medium text-text-muted uppercase tracking-wider px-4 py-3">
                                            Manhwa
                                        </th>
                                        <th className="text-left text-xs font-medium text-text-muted uppercase tracking-wider px-4 py-3 hidden md:table-cell">
                                            Type
                                        </th>
                                        <th className="text-left text-xs font-medium text-text-muted uppercase tracking-wider px-4 py-3 hidden md:table-cell">
                                            Status
                                        </th>
                                        <th className="text-left text-xs font-medium text-text-muted uppercase tracking-wider px-4 py-3 hidden lg:table-cell">
                                            Chapters
                                        </th>
                                        <th className="text-left text-xs font-medium text-text-muted uppercase tracking-wider px-4 py-3 hidden lg:table-cell">
                                            Views
                                        </th>
                                        <th className="text-left text-xs font-medium text-text-muted uppercase tracking-wider px-4 py-3 hidden xl:table-cell">
                                            Updated
                                        </th>
                                        <th className="text-right text-xs font-medium text-text-muted uppercase tracking-wider px-4 py-3">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-surface-border">
                                    {data.data.data.map((manhwa: any) => (
                                        <tr key={manhwa.id} className="hover:bg-white/5 transition-colors">
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="relative w-10 h-14 rounded-lg overflow-hidden bg-surface shrink-0">
                                                        <Image
                                                            src={manhwa.coverImage}
                                                            alt={manhwa.title}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <Link
                                                            href={`/manhwa/${manhwa.slug}`}
                                                            className="font-medium text-white hover:text-primary transition-colors line-clamp-1"
                                                        >
                                                            {manhwa.title}
                                                        </Link>
                                                        {manhwa.author && (
                                                            <p className="text-xs text-text-muted truncate">
                                                                by {manhwa.author}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 hidden md:table-cell">
                                                <span className={cn('badge', getTypeColor(manhwa.type))}>
                                                    {manhwa.type}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 hidden md:table-cell">
                                                <span className={cn('badge', getStatusColor(manhwa.status))}>
                                                    {manhwa.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-text-secondary text-sm hidden lg:table-cell">
                                                {manhwa._count?.chapters || 0}
                                            </td>
                                            <td className="px-4 py-3 text-text-secondary text-sm hidden lg:table-cell">
                                                {formatNumber(manhwa.viewCount)}
                                            </td>
                                            <td className="px-4 py-3 text-text-secondary text-sm hidden xl:table-cell">
                                                {formatDate(manhwa.updatedAt)}
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center justify-end gap-1">
                                                    <Link
                                                        href={`/manhwa/${manhwa.slug}`}
                                                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                                                        title="View"
                                                    >
                                                        <Eye className="w-4 h-4 text-text-secondary" />
                                                    </Link>
                                                    <Link
                                                        href={`/admin/manhwa/${manhwa.id}/edit`}
                                                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                                                        title="Edit"
                                                    >
                                                        <Edit className="w-4 h-4 text-text-secondary" />
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(manhwa.id)}
                                                        className="p-2 hover:bg-red-500/10 rounded-lg transition-colors"
                                                        title="Delete"
                                                    >
                                                        <Trash2 className="w-4 h-4 text-red-400" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <div className="border-t border-surface-border p-4">
                            <Pagination
                                currentPage={data.data.page}
                                totalPages={data.data.totalPages}
                                onPageChange={setPage}
                            />
                        </div>
                    </>
                ) : (
                    <div className="text-center py-12">
                        <p className="text-text-muted mb-4">No manhwa found</p>
                        <Link href="/admin/manhwa/new" className="btn-primary inline-flex items-center gap-2">
                            <Plus className="w-4 h-4" />
                            Add your first manhwa
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
