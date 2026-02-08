import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting seed...');

    // Create admin user
    const adminPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'Admin@123', 12);
    const admin = await prisma.user.upsert({
        where: { email: 'admin@manhwareader.com' },
        update: {},
        create: {
            email: 'admin@manhwareader.com',
            username: 'admin',
            password: adminPassword,
            name: 'Admin',
            role: 'ADMIN',
        },
    });
    console.log('✅ Admin user created:', admin.email);

    // Create genres
    const genreData = [
        { name: 'Action', slug: 'action' },
        { name: 'Adventure', slug: 'adventure' },
        { name: 'Comedy', slug: 'comedy' },
        { name: 'Drama', slug: 'drama' },
        { name: 'Fantasy', slug: 'fantasy' },
        { name: 'Horror', slug: 'horror' },
        { name: 'Isekai', slug: 'isekai' },
        { name: 'Martial Arts', slug: 'martial-arts' },
        { name: 'Mystery', slug: 'mystery' },
        { name: 'Psychological', slug: 'psychological' },
        { name: 'Romance', slug: 'romance' },
        { name: 'Sci-Fi', slug: 'sci-fi' },
        { name: 'Slice of Life', slug: 'slice-of-life' },
        { name: 'Sports', slug: 'sports' },
        { name: 'Supernatural', slug: 'supernatural' },
        { name: 'Thriller', slug: 'thriller' },
        { name: 'Tragedy', slug: 'tragedy' },
        { name: 'School Life', slug: 'school-life' },
        { name: 'Cultivation', slug: 'cultivation' },
        { name: 'Reincarnation', slug: 'reincarnation' },
    ];

    for (const genre of genreData) {
        await prisma.genre.upsert({
            where: { slug: genre.slug },
            update: {},
            create: genre,
        });
    }
    console.log('✅ Genres created:', genreData.length);

    // Create sample manhwa entries
    const sampleManhwa: any[] = [
        {
            title: 'Solo Leveling',
            slug: 'solo-leveling',
            description: 'In a world where hunters — humans who possess supernatural abilities — battle deadly monsters to protect humanity, Sung Jinwoo is the weakest of them all. But when he finds himself in a dangerous dungeon, he gains a mysterious power that allows him to level up.',
            coverImage: '/uploads/covers/solo-leveling.jpg',
            author: 'Chugong',
            artist: 'DUBU (Redice Studio)',
            status: 'COMPLETED',
            type: 'MANHWA',
            isHot: true,
            isFeatured: true,
            viewCount: 1500000,
            rating: 9.2,
            ratingCount: 25000,
            releaseYear: 2018,
        },
        {
            title: 'Tower of God',
            slug: 'tower-of-god',
            description: 'What do you desire? Money and wealth? Honor and pride? Authority and power? Revenge? Or something that transcends them all? Whatever you desire — it\'s here.',
            coverImage: '/uploads/covers/tower-of-god.jpg',
            author: 'SIU',
            artist: 'SIU',
            status: 'ONGOING',
            type: 'MANHWA',
            isHot: true,
            isFeatured: true,
            viewCount: 2000000,
            rating: 9.0,
            ratingCount: 30000,
            releaseYear: 2010,
        },
        {
            title: 'The Beginning After The End',
            slug: 'the-beginning-after-the-end',
            description: 'King Grey has unrivaled strength, wealth, and prestige in a world governed by martial ability. However, solitude lingers closely behind those with great power. Beneath the glamorous exterior lies a shell of a man, devoid of purpose and will.',
            coverImage: '/uploads/covers/tbate.jpg',
            author: 'TurtleMe',
            artist: 'Fuyuki23',
            status: 'ONGOING',
            type: 'MANHWA',
            isHot: true,
            isFeatured: false,
            viewCount: 1800000,
            rating: 9.1,
            ratingCount: 22000,
            releaseYear: 2018,
        },
        {
            title: 'Omniscient Reader',
            slug: 'omniscient-reader',
            description: 'Dokja was an ordinary office worker who spent his free time reading his favorite web novel "Three Ways to Survive the Apocalypse." Then one day, the novel became reality and Dokja was the only person who knew how to survive.',
            coverImage: '/uploads/covers/omniscient-reader.jpg',
            author: 'Sing Shong',
            artist: 'Sleepy-C',
            status: 'ONGOING',
            type: 'MANHWA',
            isHot: true,
            isFeatured: true,
            viewCount: 1200000,
            rating: 9.3,
            ratingCount: 18000,
            releaseYear: 2020,
        },
    ];

    const genres = await prisma.genre.findMany();

    for (const manhwaData of sampleManhwa) {
        const manhwa = await prisma.manhwa.upsert({
            where: { slug: manhwaData.slug },
            update: {},
            create: {
                ...manhwaData,
                genres: {
                    connect: genres.slice(0, 4).map((g: any) => ({ id: g.id })),
                },
            },
        });

        // Create sample chapters for each manhwa
        const chapterCount = 5;
        for (let i = 1; i <= chapterCount; i++) {
            await prisma.chapter.upsert({
                where: {
                    manhwaId_chapterNumber: {
                        manhwaId: manhwa.id,
                        chapterNumber: i,
                    },
                },
                update: {},
                create: {
                    manhwaId: manhwa.id,
                    chapterNumber: i,
                    title: `Chapter ${i}`,
                    slug: `chapter-${i}`,
                    pages: JSON.stringify([
                        `/uploads/chapters/${manhwa.slug}/ch-${i}/1.jpg`,
                        `/uploads/chapters/${manhwa.slug}/ch-${i}/2.jpg`,
                        `/uploads/chapters/${manhwa.slug}/ch-${i}/3.jpg`,
                    ]),
                    pageCount: 3,
                    viewCount: Math.floor(Math.random() * 10000),
                },
            });
        }

        console.log(`✅ Manhwa created: ${manhwa.title} with ${chapterCount} chapters`);
    }

    // Create site settings
    await prisma.siteSettings.upsert({
        where: { id: 'main' },
        update: {},
        create: {
            siteName: 'ManhwaReader',
            siteDescription: 'Read your favorite manhwa, manga, and webtoons online for free!',
        },
    });
    console.log('✅ Site settings created');

    console.log('🎉 Seed completed successfully!');
}

main()
    .catch((e) => {
        console.error('❌ Seed failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
