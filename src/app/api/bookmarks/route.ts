import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const bookmarks = await prisma.bookmark.findMany({
            where: { userId: session.user.id },
            include: {
                manhwa: {
                    include: {
                        genres: true,
                        chapters: {
                            orderBy: { createdAt: 'desc' },
                            take: 1,
                        },
                        _count: { select: { chapters: true } },
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });

        return NextResponse.json({
            success: true,
            data: bookmarks.map((b: any) => b.manhwa),
        });
    } catch (error) {
        console.error('Error fetching bookmarks:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch bookmarks' },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const { manhwaId } = await request.json();

        if (!manhwaId) {
            return NextResponse.json(
                { success: false, error: 'Manhwa ID required' },
                { status: 400 }
            );
        }

        // Check if already bookmarked
        const existing = await prisma.bookmark.findUnique({
            where: {
                userId_manhwaId: {
                    userId: session.user.id,
                    manhwaId,
                },
            },
        });

        if (existing) {
            return NextResponse.json({
                success: true,
                data: existing,
                message: 'Already bookmarked',
            });
        }

        const bookmark = await prisma.bookmark.create({
            data: {
                userId: session.user.id,
                manhwaId,
            },
        });

        // Increment bookmark count
        await prisma.manhwa.update({
            where: { id: manhwaId },
            data: { bookmarkCount: { increment: 1 } },
        });

        return NextResponse.json({
            success: true,
            data: bookmark,
        });
    } catch (error) {
        console.error('Error creating bookmark:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to create bookmark' },
            { status: 500 }
        );
    }
}

export async function DELETE(request: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const { manhwaId } = await request.json();

        if (!manhwaId) {
            return NextResponse.json(
                { success: false, error: 'Manhwa ID required' },
                { status: 400 }
            );
        }

        await prisma.bookmark.delete({
            where: {
                userId_manhwaId: {
                    userId: session.user.id,
                    manhwaId,
                },
            },
        });

        // Decrement bookmark count
        await prisma.manhwa.update({
            where: { id: manhwaId },
            data: { bookmarkCount: { decrement: 1 } },
        });

        return NextResponse.json({
            success: true,
            message: 'Bookmark removed',
        });
    } catch (error) {
        console.error('Error deleting bookmark:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to delete bookmark' },
            { status: 500 }
        );
    }
}
