import { Role } from '../models/Role.js';
import type { IRole } from '../models/Role.js';
import type { IRoleRepository } from './interfaces/IRoleRepository.js';

export class RoleRepository implements IRoleRepository {
    async findByName(name: string): Promise<IRole | null> {
        return await Role.findOne({ name });
    }

    async create(roleData: Partial<IRole>): Promise<IRole> {
        return await Role.create(roleData);
    }

    async findAll(): Promise<IRole[]> {
        return await Role.find();
    }
}