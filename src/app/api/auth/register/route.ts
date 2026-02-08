import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { prisma } from '@/lib/db';

const registerSchema = z.object({
    username: z.string().min(3).max(30).regex(/^[a-zA-Z0-9_]+$/),
    email: z.string().email(),
    password: z.string().min(8),
});

export async function POST(request: Request) {
    try {
        const body = await request.json();

        const validatedData = registerSchema.parse(body);

        // Check if email already exists
        const existingEmail = await prisma.user.findUnique({
            where: { email: validatedData.email },
        });

        if (existingEmail) {
            return NextResponse.json(
                { error: 'Email already in use' },
                { status: 400 }
            );
        }

        // Check if username already exists
        const existingUsername = await prisma.user.findUnique({
            where: { username: validatedData.username },
        });

        if (existingUsername) {
            return NextResponse.json(
                { error: 'Username already taken' },
                { status: 400 }
            );
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(validatedData.password, 12);

        // Create user
        const user = await prisma.user.create({
            data: {
                email: validatedData.email,
                username: validatedData.username,
                password: hashedPassword,
                name: validatedData.username,
            },
        });

        return NextResponse.json({
            success: true,
            data: {
                id: user.id,
                email: user.email,
                username: user.username,
            },
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: 'Invalid input', details: error.errors },
                { status: 400 }
            );
        }

        console.error('Registration error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
