import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);

        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '20');
        const search = searchParams.get('search') || '';
        const status = searchParams.get('status') || '';
        const type = searchParams.get('type') || '';
        const genres = searchParams.get('genres') || '';
        const sort = searchParams.get('sort') || 'latest';

        const skip = (page - 1) * limit;

        // Build where clause
        const where: any = {};

        if (search) {
            where.OR = [
                { title: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
                { author: { contains: search, mode: 'insensitive' } },
            ];
        }

        if (status) {
            where.status = status;
        }

        if (type) {
            where.type = type;
        }

        if (genres) {
            const genreSlugs = genres.split(',');
            where.genres = {
                some: {
                    slug: { in: genreSlugs },
                },
            };
        }

        // Build order by clause
        let orderBy: any = { updatedAt: 'desc' };
        switch (sort) {
            case 'popular':
                orderBy = { viewCount: 'desc' };
                break;
            case 'rating':
                orderBy = { rating: 'desc' };
                break;
            case 'alphabetical':
                orderBy = { title: 'asc' };
                break;
            case 'latest':
            default:
                orderBy = { updatedAt: 'desc' };
        }

        // Fetch data
        const [manhwas, total] = await Promise.all([
            prisma.manhwa.findMany({
                where,
                include: {
                    genres: true,
                    chapters: {
                        orderBy: { createdAt: 'desc' },
                        take: 1,
                        select: { chapterNumber: true, createdAt: true },
                    },
                    _count: {
                        select: { chapters: true, bookmarks: true },
                    },
                },
                orderBy,
                skip,
                take: limit,
            }),
            prisma.manhwa.count({ where }),
        ]);

        return NextResponse.json({
            success: true,
            data: {
                data: manhwas,
                total,
                page,
                pageSize: limit,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error('Error fetching manhwa:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch manhwa' },
            { status: 500 }
        );
    }
}
