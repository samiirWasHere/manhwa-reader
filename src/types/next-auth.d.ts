import 'next-auth';
import { Role } from '@prisma/client';

declare module 'next-auth' {
    interface User {
        id: string;
        username: string;
        role: Role;
    }

    interface Session {
        user: {
            id: string;
            email: string;
            name?: string | null;
            image?: string | null;
            username: string;
            role: string;
        };
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        id: string;
        username: string;
        role: string;
    }
}
