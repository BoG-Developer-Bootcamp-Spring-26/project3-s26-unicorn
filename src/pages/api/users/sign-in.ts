import type { NextApiRequest, NextApiResponse } from "next";
import { signInUser } from "@/db/actions/users";

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

    const { email, password } = req.body ?? {};

    if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required." });
    }

    if (typeof email !== "string" || typeof password !== "string") {
        return res.status(400).json({ error: "Invalid field types." });
    }

    try {
        const user = await signInUser({ email, password });
        return res.status(200).json({ message: "Signed in successfully.", user });
    } catch (error) {
        if (error instanceof Error) {
            return res.status(401).json({ error: error.message });
        }

        return res.status(500).json({ error: "Unexpected error while signing in." });
    }
}
