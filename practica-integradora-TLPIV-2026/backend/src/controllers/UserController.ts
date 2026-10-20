import type { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { UserService } from '../services/UserService.js';

const validRoles = ['admin', 'operador', 'usuario'];

export class UserController {
    constructor(private readonly userService: UserService) {}

    getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const users = await this.userService.getAll();
            res.status(200).json(users);
        } catch (error) {
            next(error);
        }
    };

    assignRole = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const id = req.params.id as string;
            const { role } = req.body;

            if (!mongoose.isValidObjectId(id)) {
                res.status(400).json({ message: 'Id de usuario inválido' });
                return;
            }

            if (typeof role !== 'string' || !validRoles.includes(role)) {
                res.status(400).json({ message: `Rol inválido. Solo puede haber: ${validRoles.join(', ')}` });
                return;
            }

            const user = await this.userService.assignRole(id, role);
            if (!user) {
                res.status(404).json({ message: 'Usuario no encontrado' });
                return;
            }
            res.status(200).json(user);
        } catch (error) {
            next(error);
        }
    };
}