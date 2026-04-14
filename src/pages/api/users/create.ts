import type { NextApiRequest, NextApiResponse } from "next";
import { createUser } from "@/db/actions/users";

type ErrorResponse = {
    error: string;
};

type SuccessResponse = {
    message: string;
    user: {
        id: string;
        firstName: string;
        lastName: string;
        email: string;
        admin: boolean;
    };
};

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ErrorResponse | SuccessResponse>,
) {
    if (req.method !== "POST") {
        res.setHeader("Allow", ["POST"]);
        return res.status(405).json({ error: "Method not allowed." });
    }

    const { firstName, lastName, email, password } = req.body ?? {};

    if (!firstName || !lastName || !email || !password) {
        return res.status(400).json({ error: "All fields are required." });
    }

    if (typeof firstName !== "string" || typeof lastName !== "string" || typeof email !== "string" || typeof password !== "string") {
        return res.status(400).json({ error: "Invalid field types." });
    }

    try {
        const user = await createUser({ firstName, lastName, email, password });
        return res.status(201).json({ message: "User created successfully.", user });
    } catch (error) {
        if (error instanceof Error) {
            return res.status(400).json({ error: error.message });
        }

        return res.status(500).json({ error: "Unexpected error while creating user." });
    }
}
