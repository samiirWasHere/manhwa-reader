import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import Link from 'next/link';
import { authOptions } from '@/lib/auth';
import {
    LayoutDashboard,
    BookOpen,
    Layers,
    Users,
    Download,
    Settings,
    BarChart3
} from 'lucide-react';

const sidebarLinks = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/manhwa', label: 'Manhwa', icon: BookOpen },
    { href: '/admin/chapters', label: 'Chapters', icon: Layers },
    { href: '/admin/users', label: 'Users', icon: Users },
    { href: '/admin/scraper', label: 'Scraper', icon: Download },
    { href: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
    { href: '/admin/settings', label: 'Settings', icon: Settings },
];

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect('/auth/login?callbackUrl=/admin');
    }

    if (session.user.role !== 'ADMIN') {
        redirect('/');
    }

    return (
        <div className="min-h-screen flex">
            {/* Sidebar */}
            <aside className="w-64 bg-secondary border-r border-surface-border shrink-0 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto hidden lg:block">
                <div className="p-4">
                    <h2 className="text-lg font-bold text-white mb-1">Admin Panel</h2>
                    <p className="text-xs text-text-muted">Manage your manhwa platform</p>
                </div>

                <nav className="px-2 pb-4">
                    {sidebarLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="flex items-center gap-3 px-4 py-3 text-text-secondary hover:text-white hover:bg-white/5 rounded-lg transition-all mb-1"
                        >
                            <link.icon className="w-5 h-5" />
                            {link.label}
                        </Link>
                    ))}
                </nav>

                <div className="p-4 border-t border-surface-border">
                    <Link
                        href="/"
                        className="flex items-center gap-2 text-sm text-text-muted hover:text-white transition-colors"
                    >
                        ← Back to Site
                    </Link>
                </div>
            </aside>

            {/* Mobile Navigation */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-secondary border-t border-surface-border z-50">
                <nav className="flex items-center justify-around py-2">
                    {sidebarLinks.slice(0, 5).map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="flex flex-col items-center gap-1 px-3 py-2 text-text-secondary hover:text-white transition-colors"
                        >
                            <link.icon className="w-5 h-5" />
                            <span className="text-[10px]">{link.label}</span>
                        </Link>
                    ))}
                </nav>
            </div>

            {/* Main Content */}
            <main className="flex-1 p-6 lg:p-8 pb-24 lg:pb-8">
                {children}
            </main>
        </div>
    );
}
