import type { NextApiRequest, NextApiResponse } from "next/types";
import connectDB from "@/db/connectDB";
import argon2 from "argon2";
import { User } from "@/db/models/User";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Email and password required" });
    }
    await connectDB();

    const user = await User.findOne({ email.trim().toLowerCase() });
    if (!user) {
        return res.status(500).json({ error: "Wrong password or email" });
    }
    const validPassword = await argon2.verify(user.password, password);
    if (!validPassword) {
        return res.status(500).json({ error: "Wrong password or email" });
    }

    res.setHeader("Set-Cookie", `userId=${user._id}; Path=/; HttpOnly`);
    res.status(200).json({ success: true, id: user._id, admin: user.admin });
}
