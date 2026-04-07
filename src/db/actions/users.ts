import mongoose from "mongoose";
import connectDB from "@/db/connectDB";
import { User } from "@/db/models/User";

type CreateUserInput = {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    admin?: boolean;
};

async function createUser({ firstName, lastName, email, password, admin = false }: CreateUserInput) {
    await connectDB();

    const UserModel = mongoose.models.User || mongoose.model("User", User);

    const formattedEmail = email.trim().toLowerCase();
    const existingUser = await UserModel.findOne({ email: formattedEmail });

    if (existingUser) {
        throw new Error("A user with this email already exists.");
    }

    const objectId = new mongoose.Types.ObjectId();

    const createdUser = await UserModel.create({
        _id: objectId,
        id: objectId,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: formattedEmail,
        password,
        admin,
    });

    return {
        id: String(createdUser.id),
        firstName: String(createdUser.firstName),
        lastName: String(createdUser.lastName),
        email: String(createdUser.email),
        admin: Boolean(createdUser.admin),
    };
}

export { createUser };
export type { CreateUserInput };