import fs from 'fs';
import path from 'path';
import { pipeline } from 'stream/promises';
import { Readable } from 'stream';

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');

export async function downloadImage(
    imageUrl: string,
    manhwaSlug: string,
    filename: string
): Promise<string> {
    try {
        // Create directories if they don't exist
        const dir = path.join(UPLOAD_DIR, 'chapters', manhwaSlug);
        const subDir = path.dirname(path.join(dir, filename));
        fs.mkdirSync(subDir, { recursive: true });

        // Determine file extension
        const urlPath = new URL(imageUrl).pathname;
        const ext = path.extname(urlPath) || '.jpg';
        const filePath = path.join(dir, `${filename}${ext}`);

        // Check if file already exists
        if (fs.existsSync(filePath)) {
            return `/uploads/chapters/${manhwaSlug}/${filename}${ext}`;
        }

        // Fetch the image
        const response = await fetch(imageUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Accept': 'image/*',
                'Referer': new URL(imageUrl).origin,
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to download image: ${response.status}`);
        }

        // Save to file
        const buffer = await response.arrayBuffer();
        fs.writeFileSync(filePath, Buffer.from(buffer));

        return `/uploads/chapters/${manhwaSlug}/${filename}${ext}`;
    } catch (error) {
        console.error(`Failed to download image ${imageUrl}:`, error);
        // Return original URL as fallback
        return imageUrl;
    }
}

export async function downloadCoverImage(
    imageUrl: string,
    manhwaSlug: string
): Promise<string> {
    try {
        const dir = path.join(UPLOAD_DIR, 'covers');
        fs.mkdirSync(dir, { recursive: true });

        const urlPath = new URL(imageUrl).pathname;
        const ext = path.extname(urlPath) || '.jpg';
        const filePath = path.join(dir, `${manhwaSlug}${ext}`);

        // Fetch and save
        const response = await fetch(imageUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Accept': 'image/*',
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to download cover: ${response.status}`);
        }

        const buffer = await response.arrayBuffer();
        fs.writeFileSync(filePath, Buffer.from(buffer));

        return `/uploads/covers/${manhwaSlug}${ext}`;
    } catch (error) {
        console.error(`Failed to download cover ${imageUrl}:`, error);
        return imageUrl;
    }
}
