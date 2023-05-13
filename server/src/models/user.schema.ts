import mongoose, {Schema, model} from 'mongoose';

export interface IUser {
    id?: string,
    name: string,
    email: string,
    password: string,
    role: ROlE,
    refreshToken?: string,
    confPassword?:string,
}


type ROlE = 'ADMIN' | 'USER'
const UserSchema = new Schema<IUser>({
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        role: {
            type: String,
        },
        password: {
            type: String,
            required: true,
        },
        refreshToken: {
            type: String
        }

    },
    {
        timestamps: true,
        id: true,
        toJSON: {
            transform(doc, user) {
                user.id = user._id
                delete user._id
            }
        }
    });

export default model('User', UserSchema)
