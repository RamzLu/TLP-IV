import type { IUserRepository } from '../repositories/interfaces/IUserRepository.js';
import type { IRoleRepository } from '../repositories/interfaces/IRoleRepository.js';
import type { IUser } from '../models/User.js';

export class UserService {
    constructor(
        private readonly userRepository: IUserRepository,
        private readonly roleRepository: IRoleRepository
    ) {}

    async getAll(): Promise<IUser[]> {
        return await this.userRepository.findAll();
    }

    async assignRole(userId: string, roleName: string): Promise<IUser | null> {
        const role = await this.roleRepository.findByName(roleName);
        if (!role) {
            throw new Error(`El rol "${roleName}" no existe.`);
        }
        return await this.userRepository.updateRole(userId, role._id.toString());
    }
}