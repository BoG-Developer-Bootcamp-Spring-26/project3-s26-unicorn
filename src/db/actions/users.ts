import mongoose from "mongoose";
import connectDB from "@/db/connectDB";
import { User } from "@/db/models/User";

type CreateUserInput = {
    firstName: string;
    middleName?: string;
    lastName: string;
    email: string;
    password: string;
    admin?: boolean;
};

async function createUser({
    firstName,
    middleName,
    lastName,
    email,
    password,
    admin = false,
}: CreateUserInput) {
    await connectDB();

    const formattedEmail = email.trim().toLowerCase();
    const existingUser = await User.findOne({ email: formattedEmail });

    if (existingUser) {
        throw new Error("A user with this email already exists.");
    }

    const objectId = new mongoose.Types.ObjectId();

    const createdUser = await User.create({
        firstName: firstName.trim(),
        middleName: middleName?.trim(),
        lastName: lastName.trim(),
        email: formattedEmail,
        password,
        admin,
    });

    return {
        id: String(createdUser.id),
        firstName: String(createdUser.firstName),
        middleName: String(createdUser.middleName),
        lastName: String(createdUser.lastName),
        email: String(createdUser.email),
        admin: Boolean(createdUser.admin),
    };
}

export { createUser };
export type { CreateUserInput };
