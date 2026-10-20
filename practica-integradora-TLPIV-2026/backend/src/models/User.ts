import mongoose, {Schema, Document} from "mongoose";

export interface IUser extends Document {
    email: string;
    password: string;
    role: mongoose.Types.ObjectId;
}

const UserSchema: Schema = new Schema(
    {
        email: { 
            type: String, 
            required: true, 
            unique: true, 
            trim: true 
        },
        password: { 
            type: String, 
            required: true 
        },
        //aca se cambio porque se agregó el modelo role que se encarga de manejar los roles y permisos de los usuarios
        role: { 
            type: Schema.Types.ObjectId, 
            ref: 'Role', 
            required: true 
        }
    },
    {
        timestamps: true
    }
)

export const User = mongoose.model<IUser>('User', UserSchema)