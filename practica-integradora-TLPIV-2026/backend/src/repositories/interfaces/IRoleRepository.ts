import type { IRole } from '../../models/Role.js';

export interface IRoleRepository {
    findByName(name: string): Promise<IRole | null>;
    create(roleData: Partial<IRole>): Promise<IRole>;
    findAll(): Promise<IRole[]>;
}