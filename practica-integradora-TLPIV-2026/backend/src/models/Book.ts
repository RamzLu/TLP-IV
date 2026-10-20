import mongoose, {Schema, Document} from "mongoose";

export enum BookStatus {
    DISPONIBLE = 'DISPONIBLE',
    PRESTADO = 'PRESTADO',
    EN_REPARACION = 'EN_REPARACION'
}

export interface IBook extends Document {
    title: string;
    description: string;
    status: BookStatus;
    createdAt: Date;
    updatedAt: Date;
}

const BookSchema: Schema = new Schema (
    {
    title: { 
            type: String, 
            required: true, 
            trim: true 
        },
        description: { 
            type: String, 
            required: true 
        },
        status: {
            type: String,
            enum: Object.values(BookStatus),
            default: BookStatus.DISPONIBLE
        }
    },
    {
        timestamps: true
    }
)

export const Book = mongoose.model<IBook>('Book', BookSchema)