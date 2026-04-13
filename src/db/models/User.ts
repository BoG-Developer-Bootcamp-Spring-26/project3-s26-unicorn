import mongoose from "mongoose";

interface IUser {
    firstName: string;
    middleName?: string;
    lastName: string;
    email: string;
    password: string;
    admin: boolean;
}

const UserSchema = new mongoose.Schema<IUser>({
    firstName: {
        type: String,
        required: true,
    },
    middleName: {
        type: String,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    admin: {
        type: Boolean,
        required: true,
    },
});

export const User = mongoose.model("User", UserSchema);
