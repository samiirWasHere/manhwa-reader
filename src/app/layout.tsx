import type { Metadata } from 'next';
import { Inter, Poppins } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/providers';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const inter = Inter({
    subsets: ['latin'],
    variable: '--font-inter',
});

const poppins = Poppins({
    subsets: ['latin'],
    weight: ['400', '500', '600', '700', '800'],
    variable: '--font-poppins',
});

export const metadata: Metadata = {
    title: {
        default: 'ManhwaReader - Read Manhwa, Manga & Webtoons Online',
        template: '%s | ManhwaReader',
    },
    description: 'Read your favorite manhwa, manga, and webtoons online for free. Updated daily with the latest chapters.',
    keywords: ['manhwa', 'manga', 'webtoon', 'read online', 'free manga', 'korean comics'],
    authors: [{ name: 'ManhwaReader' }],
    openGraph: {
        type: 'website',
        locale: 'en_US',
        siteName: 'ManhwaReader',
        title: 'ManhwaReader - Read Manhwa, Manga & Webtoons Online',
        description: 'Read your favorite manhwa, manga, and webtoons online for free.',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'ManhwaReader - Read Manhwa, Manga & Webtoons Online',
        description: 'Read your favorite manhwa, manga, and webtoons online for free.',
    },
    robots: {
        index: true,
        follow: true,
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className="dark">
            <body className={`${inter.variable} ${poppins.variable} antialiased`}>
                <Providers>
                    <div className="flex min-h-screen flex-col bg-gradient-dark">
                        <Header />
                        <main className="flex-1">{children}</main>
                        <Footer />
                    </div>
                </Providers>
            </body>
        </html>
    );
}
