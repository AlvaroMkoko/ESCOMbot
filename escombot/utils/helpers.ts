import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 10;

export async function hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
}

export function formatDate(date: Date | string): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleString('es-MX', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
    });
}

export function truncateText(text: string, length: number): string {
    return text.length > length ? text.substring(0, length) + '...' : text;
}

export function generateChatTitle(firstMessage: string): string {
    return truncateText(firstMessage, 60);
}

export function mapDbRoleToFrontend(role: string): 'user' | 'bot' {
    return role === 'assistant' ? 'bot' : 'user';
}

export function mapFrontendRoleToDb(role: string): 'user' | 'assistant' {
    return role === 'bot' ? 'assistant' : 'user';
}
