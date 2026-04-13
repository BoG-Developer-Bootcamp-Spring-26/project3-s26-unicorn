import argon2 from "argon2";
import { NextResponse } from "next/server";

import { connectDB } from "@/db/connectDB";
import { User } from "@/db/models/User";

type VerifyBody = {
    email?: unknown;
    password?: unknown;
};

export async function POST(request: Request) {
    let body: VerifyBody;
    try {
        body = await request.json();
    } catch {
        return NextResponse.json(
            { success: false, message: "Invalid JSON body" },
            { status: 500 },
        );
    }

    const { email, password } = body;

    if (
        typeof email !== "string" ||
        !email.trim() ||
        typeof password !== "string" ||
        !password
    ) {
        return NextResponse.json(
            { success: false, message: "email and password are required" },
            { status: 500 },
        );
    }

    try {
        await connectDB();

        const user = await User.findOne({
            email: email.trim().toLowerCase(),
        }).lean();

        if (!user) {
            return NextResponse.json(
                { success: false, message: "Invalid email or password" },
                { status: 500 },
            );
        }

        const valid = await argon2.verify(user.password, password);
        if (!valid) {
            return NextResponse.json(
                { success: false, message: "Invalid email or password" },
                { status: 500 },
            );
        }

        return NextResponse.json(
            {
                success: true,
                message: "User verified",
                id: user._id.toString(),
                admin: user.admin,
            },
            { status: 200 },
        );
    } catch (e) {
        console.error(e);
        return NextResponse.json(
            { success: false, message: "Unable to verify user" },
            { status: 500 },
        );
    }
}
