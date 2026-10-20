import mongoose, { Schema, Document } from 'mongoose';

export interface IRole extends Document {
    name: string;
    permissions: string[];
}

const RoleSchema: Schema = new Schema(
    {
        name: { 
            type: String, 
            required: true, 
            unique: true,
            enum: ['admin', 'operador', 'usuario']
        },
        permissions: { 
            type: [String], 
            default: [] 
        }
    },
    {
        timestamps: true
    }
);

export const Role = mongoose.model<IRole>('Role', RoleSchema);