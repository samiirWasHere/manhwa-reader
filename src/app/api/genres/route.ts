import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
    try {
        const genres = await prisma.genre.findMany({
            include: {
                _count: { select: { manhwas: true } },
            },
            orderBy: { name: 'asc' },
        });

        return NextResponse.json({
            success: true,
            data: genres,
        });
    } catch (error) {
        console.error('Error fetching genres:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch genres' },
            { status: 500 }
        );
    }
}
