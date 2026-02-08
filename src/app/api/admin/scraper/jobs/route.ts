import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { scrapeFromUrl } from '@/scraper';

export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user || session.user.role !== 'ADMIN') {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const jobs = await prisma.scraperJob.findMany({
            orderBy: { createdAt: 'desc' },
            take: 50,
        });

        return NextResponse.json({
            success: true,
            data: jobs,
        });
    } catch (error) {
        console.error('Error fetching scraper jobs:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch jobs' },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user || session.user.role !== 'ADMIN') {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const { sourceUrl, sourceName } = await request.json();

        if (!sourceUrl) {
            return NextResponse.json(
                { success: false, error: 'Source URL is required' },
                { status: 400 }
            );
        }

        // Create job record
        const job = await prisma.scraperJob.create({
            data: {
                sourceUrl,
                sourceName: sourceName || 'generic',
                status: 'PENDING',
            },
        });

        // Start scraping in background (don't await)
        scrapeFromUrl(job.id, sourceUrl, sourceName).catch((err) => {
            console.error('Scraper error:', err);
        });

        return NextResponse.json({
            success: true,
            data: job,
        });
    } catch (error) {
        console.error('Error creating scraper job:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to create job' },
            { status: 500 }
        );
    }
}
