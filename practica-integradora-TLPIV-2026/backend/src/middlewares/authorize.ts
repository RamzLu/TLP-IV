import type { Request, Response, NextFunction } from 'express';

export function authorize(permission: string) {
    return (req: Request, res: Response, next: NextFunction): void => {
        if (!req.user) {
            res.status(401).json({ message: 'No autenticado' });
            return;
        }

        if (!req.user.permissions.includes(permission)) {
            res.status(403).json({ message: 'No tenés permiso para realizar esta acción' });
            return;
        }

        next();
    };
}