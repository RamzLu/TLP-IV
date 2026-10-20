import type { IUser } from "../../models/User.js";

export interface IUserRepository {
    findByEmail(email: string): Promise<IUser | null>;
    findById(id: string): Promise<IUser | null>;
    findAll(): Promise<IUser[]>;
    create(userData: Partial<IUser>): Promise<IUser>;
    updateRole(id: string, role: string): Promise<IUser | null>;
}