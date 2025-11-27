import crypto from 'crypto';

export function generateToken(): string {
    return crypto.randomBytes(16).toString('hex');
}

export function getExpirationDate(seconds: number): Date {
    return new Date(Date.now() + seconds * 1000);
}
