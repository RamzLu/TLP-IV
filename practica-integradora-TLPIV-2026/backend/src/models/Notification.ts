import mongoose, { Schema, Document } from 'mongoose';

export interface INotification extends Document {
    user: mongoose.Types.ObjectId;
    book: mongoose.Types.ObjectId;
    message: string;
    isRead: boolean;
    createdAt: Date;
}

const NotificationSchema: Schema = new Schema(
    {
        user: { 
            type: Schema.Types.ObjectId, 
            ref: 'User', 
            required: true 
        },
        book: { 
            type: Schema.Types.ObjectId, 
            ref: 'Book', 
            required: true 
        },
        message: { 
            type: String, 
            required: true 
        },
        isRead: { 
            type: Boolean, 
            default: false // por defecto arranca como no leida
        }
    },
    {
        timestamps: true
    }
);

export const Notification = mongoose.model<INotification>('Notification', NotificationSchema);