import argon2 from "argon2";
import type { NextApiRequest, NextApiResponse } from "next";
import connectDB from "@/db/connectDB";
import { User } from "@/db/models/User";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    console.log(req.body);
    if (req.method == "POST") {
        const { firstName, middleName, lastName, email, password, admin } =
            req.body;

        if (
            typeof firstName !== "string" ||
            !firstName.trim() ||
            (typeof middleName !== "undefined" && typeof middleName !== "string") ||
            typeof lastName !== "string" ||
            !lastName.trim() ||
            typeof email !== "string" ||
            !email.trim() ||
            typeof password !== "string" ||
            !password
        ) {
            return res.status(500).json({
                success: false,
                message: "Missing or invalid first name, last name, email, or password",
            });
        }

        if (typeof admin !== "boolean") {
            return res
                .status(500)
                .json({ success: false, message: "admin must be a boolean" });
        }

        let passwordHash: string;
        try {
            passwordHash = await argon2.hash(password);
        } catch (e) {
            console.error(e);
            return res
                .status(500)
                .json({ success: false, message: "Unable to hash password" });
        }

        try {
            await connectDB();
            const user = await User.create({
                firstName: firstName.trim(),
                middleName: middleName?.trim(),
                lastName: lastName.trim(),
                email: email.trim().toLowerCase(),
                password: passwordHash,
                admin: admin,
            });
            return res.status(200).json({
                success: true,
                message: "User created successfully",
                id: user._id.toString(),
                firstName: user.firstName,
                middleName: user.middleName,
                lastName: user.lastName,
                email: user.email,
                admin: user.admin,
            });
        } catch (e) {
            console.error(e);
            return res
                .status(500)
                .json({ success: false, message: "Unable to create user" });
        }
    }
}
