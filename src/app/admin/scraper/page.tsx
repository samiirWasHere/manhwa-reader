'use client';

import { useState } from 'react';
import useSWR from 'swr';
import {
    Play,
    Pause,
    Plus,
    Trash2,
    RefreshCw,
    CheckCircle,
    XCircle,
    Clock,
    Loader2,
    ExternalLink,
    AlertCircle
} from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { cn } from '@/lib/utils';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const sourceOptions = [
    { value: 'asura', label: 'AsuraScans', placeholder: 'https://asuracomic.net/series/...' },
    { value: 'reaper', label: 'ReaperScans', placeholder: 'https://reaperscans.com/series/...' },
    { value: 'flame', label: 'FlameScans', placeholder: 'https://flamescans.org/series/...' },
    { value: 'generic', label: 'Generic (Auto-detect)', placeholder: 'https://example.com/manga/...' },
];

export default function AdminScraperPage() {
    const [sourceUrl, setSourceUrl] = useState('');
    const [selectedSource, setSelectedSource] = useState('generic');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const { data, isLoading, mutate } = useSWR('/api/admin/scraper/jobs', fetcher);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!sourceUrl.trim()) {
            setError('Please enter a URL');
            return;
        }

        try {
            new URL(sourceUrl);
        } catch {
            setError('Please enter a valid URL');
            return;
        }

        setIsSubmitting(true);

        try {
            const res = await fetch('/api/admin/scraper/jobs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    sourceUrl,
                    sourceName: selectedSource,
                }),
            });

            if (res.ok) {
                setSourceUrl('');
                mutate();
            } else {
                const data = await res.json();
                setError(data.error || 'Failed to start scraper job');
            }
        } catch (err) {
            setError('An error occurred');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = async (jobId: string) => {
        try {
            await fetch(`/api/admin/scraper/jobs/${jobId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'CANCELLED' }),
            });
            mutate();
        } catch (error) {
            console.error('Cancel error:', error);
        }
    };

    const handleRetry = async (jobId: string) => {
        try {
            await fetch(`/api/admin/scraper/jobs/${jobId}/retry`, {
                method: 'POST',
            });
            mutate();
        } catch (error) {
            console.error('Retry error:', error);
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'COMPLETED':
                return <CheckCircle className="w-5 h-5 text-green-400" />;
            case 'RUNNING':
                return <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />;
            case 'FAILED':
                return <XCircle className="w-5 h-5 text-red-400" />;
            default:
                return <Clock className="w-5 h-5 text-yellow-400" />;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'COMPLETED':
                return 'text-green-400 bg-green-400/10';
            case 'RUNNING':
                return 'text-blue-400 bg-blue-400/10';
            case 'FAILED':
                return 'text-red-400 bg-red-400/10';
            default:
                return 'text-yellow-400 bg-yellow-400/10';
        }
    };

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-white">Scraper Management</h1>
                <p className="text-text-secondary mt-1">Import manhwa from external sources</p>
            </div>

            {/* Add New Job */}
            <div className="card p-6 mb-8">
                <h2 className="font-semibold text-white mb-4 flex items-center gap-2">
                    <Plus className="w-5 h-5 text-primary" />
                    Add Scraper Job
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                        <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                            <AlertCircle className="w-4 h-4 shrink-0" />
                            {error}
                        </div>
                    )}

                    <div className="grid md:grid-cols-3 gap-4">
                        <div className="md:col-span-2">
                            <label className="block text-sm text-text-muted mb-2">Manhwa URL</label>
                            <input
                                type="text"
                                value={sourceUrl}
                                onChange={(e) => setSourceUrl(e.target.value)}
                                placeholder={sourceOptions.find((s) => s.value === selectedSource)?.placeholder}
                                className="input-field"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-text-muted mb-2">Source</label>
                            <select
                                value={selectedSource}
                                onChange={(e) => setSelectedSource(e.target.value)}
                                className="input-field"
                            >
                                {sourceOptions.map((opt) => (
                                    <option key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="btn-primary flex items-center gap-2"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Processing...
                                </>
                            ) : (
                                <>
                                    <Play className="w-4 h-4" />
                                    Start Scraping
                                </>
                            )}
                        </button>
                    </div>
                </form>

                <div className="mt-4 p-4 bg-surface rounded-lg">
                    <h3 className="text-sm font-medium text-white mb-2">Supported Sources</h3>
                    <ul className="text-sm text-text-muted space-y-1">
                        <li>• <strong>AsuraScans</strong> - Korean manhwa translations</li>
                        <li>• <strong>ReaperScans</strong> - Popular manhwa scanlations</li>
                        <li>• <strong>FlameScans</strong> - High-quality manhwa releases</li>
                        <li>• <strong>Generic</strong> - Auto-detect common manga site patterns</li>
                    </ul>
                </div>
            </div>

            {/* Jobs List */}
            <div className="card">
                <div className="flex items-center justify-between p-4 border-b border-surface-border">
                    <h2 className="font-semibold text-white">Scraper Jobs</h2>
                    <button
                        onClick={() => mutate()}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                        title="Refresh"
                    >
                        <RefreshCw className="w-4 h-4 text-text-secondary" />
                    </button>
                </div>

                {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                ) : data?.data?.length > 0 ? (
                    <div className="divide-y divide-surface-border">
                        {data.data.map((job: any) => (
                            <div key={job.id} className="p-4 hover:bg-white/5 transition-colors">
                                <div className="flex items-start gap-4">
                                    {getStatusIcon(job.status)}

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className={cn('badge', getStatusColor(job.status))}>
                                                {job.status}
                                            </span>
                                            <span className="text-xs text-text-muted">
                                                {job.sourceName}
                                            </span>
                                        </div>

                                        <a
                                            href={job.sourceUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-sm text-white hover:text-primary transition-colors flex items-center gap-1 mb-1"
                                        >
                                            {job.sourceUrl}
                                            <ExternalLink className="w-3 h-3" />
                                        </a>

                                        <div className="text-xs text-text-muted">
                                            Created {formatDate(job.createdAt)}
                                            {job.completedAt && ` • Completed ${formatDate(job.completedAt)}`}
                                        </div>

                                        {job.error && (
                                            <p className="mt-2 text-sm text-red-400 bg-red-400/10 p-2 rounded">
                                                Error: {job.error}
                                            </p>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-1">
                                        {job.status === 'FAILED' && (
                                            <button
                                                onClick={() => handleRetry(job.id)}
                                                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                                                title="Retry"
                                            >
                                                <RefreshCw className="w-4 h-4 text-text-secondary" />
                                            </button>
                                        )}
                                        {job.status === 'RUNNING' && (
                                            <button
                                                onClick={() => handleCancel(job.id)}
                                                className="p-2 hover:bg-red-500/10 rounded-lg transition-colors"
                                                title="Cancel"
                                            >
                                                <Pause className="w-4 h-4 text-red-400" />
                                            </button>
                                        )}
                                        <button
                                            onClick={() => {
                                                // Delete job
                                            }}
                                            className="p-2 hover:bg-red-500/10 rounded-lg transition-colors"
                                            title="Delete"
                                        >
                                            <Trash2 className="w-4 h-4 text-red-400" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <p className="text-text-muted">No scraper jobs yet</p>
                        <p className="text-sm text-text-muted mt-1">
                            Add a URL above to start importing manhwa
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
