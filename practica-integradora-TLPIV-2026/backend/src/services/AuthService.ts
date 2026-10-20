import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import type { Types } from 'mongoose';
import type { IUserRepository } from '../repositories/interfaces/IUserRepository.js';
import type { IRoleRepository } from '../repositories/interfaces/IRoleRepository.js';
import type { IRole } from '../models/Role.js';

export interface LoginResult {
    token: string;
    user: {
        id: string;
        email: string;
        role: string;
        permissions: string[];
    };
}

export class AuthService {
    constructor(
        private readonly userRepository: IUserRepository,
        private readonly roleRepository: IRoleRepository,
        private readonly jwtSecret: string
    ) {}

    async register(email: string, password: string): Promise<{ id: string; email: string } | null> {
        const existing = await this.userRepository.findByEmail(email);
        if (existing) {
            return null;
        }
        const defaultRole = await this.roleRepository.findByName('usuario');
        if (!defaultRole) {
            throw new Error('El rol usuario no existe');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await this.userRepository.create({
            email,
            password: hashedPassword,
            role: defaultRole._id as Types.ObjectId
        });
        return { id: user._id.toString(), email: user.email };
    }

    async login(email: string, password: string): Promise<LoginResult | null> {
        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            return null;
        }

        const passwordOk = await bcrypt.compare(password, user.password);
        if (!passwordOk) {
            return null;
        }

        const role = user.role as unknown as IRole;

        const token = jwt.sign(
            {
                sub: user._id.toString(),
                email: user.email,
                role: role.name,
                permissions: role.permissions
            },
            this.jwtSecret,
            { expiresIn: '1h' }
        );

        return {
            token,
            user: {
                id: user._id.toString(),
                email: user.email,
                role: role.name,
                permissions: role.permissions
            }
        };
    }
}