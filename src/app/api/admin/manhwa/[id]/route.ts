import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { z } from 'zod';
import { slugify } from '@/lib/utils';

const manhwaSchema = z.object({
    title: z.string().min(1),
    description: z.string().optional(),
    coverImage: z.string().optional(),
    bannerImage: z.string().optional(),
    author: z.string().optional(),
    artist: z.string().optional(),
    status: z.enum(['ONGOING', 'COMPLETED', 'HIATUS']).optional(),
    type: z.enum(['MANHWA', 'MANGA', 'MANHUA', 'WEBTOON']).optional(),
    genres: z.array(z.string()).optional(),
});

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const manhwa = await prisma.manhwa.findUnique({
            where: { id: params.id },
            include: {
                genres: true,
                chapters: { orderBy: { chapterNumber: 'desc' } },
                _count: { select: { chapters: true, bookmarks: true } },
            },
        });

        if (!manhwa) {
            return NextResponse.json(
                { success: false, error: 'Manhwa not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, data: manhwa });
    } catch (error) {
        console.error('Error fetching manhwa:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch manhwa' },
            { status: 500 }
        );
    }
}

export async function PATCH(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user || session.user.role !== 'ADMIN') {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const body = await request.json();
        const validatedData = manhwaSchema.partial().parse(body);

        const updateData: any = { ...validatedData };

        // Handle genres separately
        if (validatedData.genres) {
            const genreConnections = [];
            for (const genreName of validatedData.genres) {
                const slug = slugify(genreName);
                const genre = await prisma.genre.upsert({
                    where: { slug },
                    update: {},
                    create: { name: genreName, slug },
                });
                genreConnections.push({ id: genre.id });
            }
            updateData.genres = { set: genreConnections };
            delete updateData.genres;
        }

        const manhwa = await prisma.manhwa.update({
            where: { id: params.id },
            data: updateData,
            include: { genres: true },
        });

        return NextResponse.json({ success: true, data: manhwa });
    } catch (error) {
        console.error('Error updating manhwa:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to update manhwa' },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user || session.user.role !== 'ADMIN') {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Delete related records first
        await prisma.chapter.deleteMany({ where: { manhwaId: params.id } });
        await prisma.bookmark.deleteMany({ where: { manhwaId: params.id } });
        await prisma.readingHistory.deleteMany({ where: { manhwaId: params.id } });
        await prisma.comment.deleteMany({ where: { manhwaId: params.id } });
        await prisma.rating.deleteMany({ where: { manhwaId: params.id } });

        // Delete manhwa
        await prisma.manhwa.delete({ where: { id: params.id } });

        return NextResponse.json({ success: true, message: 'Manhwa deleted' });
    } catch (error) {
        console.error('Error deleting manhwa:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to delete manhwa' },
            { status: 500 }
        );
    }
}
