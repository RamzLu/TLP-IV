import type { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/AuthService.js';

export class AuthController {
    constructor(private readonly authService: AuthService) {}

    register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { email, password } = req.body;

            if (typeof email !== 'string' || typeof password !== 'string' || !email.trim() || password.length < 6) {
                res.status(400).json({ message: 'email es obligatorio y password debe tener al menos 6 caracteres' });
                return;
            }

            const user = await this.authService.register(email.trim(), password);
            if (!user) {
                res.status(409).json({ message: 'El email ya está registrado' });
                return;
            }
            res.status(201).json(user);
        } catch (error) {
            next(error);
        }
    };

    login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { email, password } = req.body;

            if (typeof email !== 'string' || typeof password !== 'string' || !email.trim() || !password) {
                res.status(400).json({ message: 'email y password son obligatorios' });
                return;
            }

            const result = await this.authService.login(email.trim(), password);
            if (!result) {
                res.status(401).json({ message: 'Credenciales inválidas' });
                return;
            }
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    };
}