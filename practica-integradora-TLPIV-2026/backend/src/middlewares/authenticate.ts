import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthPayload {
    sub: string;
    email: string;
    role: string;
    permissions: string[];
}
declare global {
    namespace Express {
        interface Request {
            user?: AuthPayload;
        }
    }
}

export function authenticate(req: Request, res: Response, next: NextFunction): void {
    const header = req.headers.authorization;

    if (!header || !header.startsWith('Bearer ')) {
        res.status(401).json({ message: 'Token requerido' });
        return;
    }

    const token = header.slice(7); 

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as unknown as AuthPayload;
        req.user = decoded;
        next();
    } catch {
        res.status(401).json({ message: 'Token inválido o expirado' });
    }
}