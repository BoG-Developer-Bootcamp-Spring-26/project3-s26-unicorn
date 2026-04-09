import argon2 from "argon2";
import { NextResponse } from "next/server";
import { connectDB } from "@/db/connectDB";
import { User } from "@/db/models/User";

type CreateUserBody = {
  fullName?: unknown;
  email?: unknown;
  password?: unknown;
  admin?: unknown;
};

export async function POST(request: Request) {
  let body: CreateUserBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, message: "Invalid JSON body" },
      { status: 400 },
    );
  }

  const { fullName, email, password, admin } = body;

  if (
    typeof fullName !== "string" ||
    !fullName.trim() ||
    typeof email !== "string" ||
    !email.trim() ||
    typeof password !== "string" ||
    !password
  ) {
    return NextResponse.json(
      {
        success: false,
        message: "Missing or invalid fullName, email, or password",
      },
      { status: 400 },
    );
  }

  if (typeof admin !== "boolean") {
    return NextResponse.json(
      { success: false, message: "admin must be a boolean" },
      { status: 400 },
    );
  }

  let passwordHash: string;
  try {
    passwordHash = await argon2.hash(password);
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { success: false, message: "Unable to hash password" },
      { status: 500 },
    );
  }

  try {
    await connectDB();

    const user = await User.create({
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      password: passwordHash,
      admin,
    });

    return NextResponse.json(
      {
        success: true,
        message: "User created successfully",
        id: user._id.toString(),
        fullName: user.fullName,
        email: user.email,
        admin: user.admin,
      },
      { status: 200 },
    );
  } catch (e) {
    if (
      e &&
      typeof e === "object" &&
      "code" in e &&
      (e as { code: number }).code === 11000
    ) {
      return NextResponse.json(
        { success: false, message: "Email already registered" },
        { status: 400 },
      );
    }

    console.error(e);
    return NextResponse.json(
      { success: false, message: "Unable to create user" },
      { status: 500 },
    );
  }
}
