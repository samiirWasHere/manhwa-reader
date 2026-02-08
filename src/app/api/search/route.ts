import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const query = searchParams.get('q') || '';
        const limit = parseInt(searchParams.get('limit') || '10');

        if (!query.trim()) {
            return NextResponse.json({
                success: true,
                data: [],
            });
        }

        const results = await prisma.manhwa.findMany({
            where: {
                OR: [
                    { title: { contains: query, mode: 'insensitive' } },
                    { author: { contains: query, mode: 'insensitive' } },
                    { artist: { contains: query, mode: 'insensitive' } },
                ],
            },
            select: {
                id: true,
                title: true,
                slug: true,
                coverImage: true,
                type: true,
                status: true,
            },
            orderBy: { viewCount: 'desc' },
            take: limit,
        });

        return NextResponse.json({
            success: true,
            data: results,
        });
    } catch (error) {
        console.error('Search error:', error);
        return NextResponse.json(
            { success: false, error: 'Search failed' },
            { status: 500 }
        );
    }
}
