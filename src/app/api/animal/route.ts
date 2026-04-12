import { NextResponse } from "next/server";

import { connectDB } from "@/db/connectDB";
import { Animal } from "@/db/models/Animal";
import { isValidObjectId } from "@/lib/objectId";

type CreateAnimalBody = {
    name?: unknown;
    breed?: unknown;
    owner?: unknown;
    hoursTrained?: unknown;
    profilePicture?: unknown;
};

type PatchAnimalBody = {
    id?: unknown;
    hoursTrained?: unknown;
};

export async function POST(request: Request) {
    let body: CreateAnimalBody;
    try {
        body = await request.json();
    } catch {
        return NextResponse.json(
            { success: false, message: "Invalid JSON body" },
            { status: 400 },
        );
    }

    const { name, breed, owner, hoursTrained, profilePicture } = body;

    if (
        typeof name !== "string" ||
        !name.trim() ||
        typeof breed !== "string" ||
        !breed.trim() ||
        !isValidObjectId(owner) ||
        typeof hoursTrained !== "number" ||
        Number.isNaN(hoursTrained) ||
        hoursTrained < 0 ||
        typeof profilePicture !== "string" ||
        !profilePicture.trim()
    ) {
        return NextResponse.json(
            {
                success: false,
                message:
                    "Missing or invalid name, breed, owner (ObjectId), non-negative hoursTrained, or profilePicture",
            },
            { status: 400 },
        );
    }

    try {
        await connectDB();

        const animal = await Animal.create({
            name: name.trim(),
            breed: breed.trim(),
            owner,
            hoursTrained,
            profilePicture: profilePicture.trim(),
        });

        return NextResponse.json(
            {
                success: true,
                message: "Animal created successfully",
                id: animal._id.toString(),
                name: animal.name,
                breed: animal.breed,
                owner: animal.owner.toString(),
                hoursTrained: animal.hoursTrained,
                profilePicture: animal.profilePicture,
            },
            { status: 200 },
        );
    } catch (e) {
        console.error(e);
        return NextResponse.json(
            { success: false, message: "Unable to create animal" },
            { status: 500 },
        );
    }
}

export async function PATCH(request: Request) {
    let body: PatchAnimalBody;
    try {
        body = await request.json();
    } catch {
        return NextResponse.json(
            { success: false, message: "Invalid JSON body" },
            { status: 400 },
        );
    }

    const { id, hoursTrained } = body;

    if (
        !isValidObjectId(id) ||
        typeof hoursTrained !== "number" ||
        Number.isNaN(hoursTrained) ||
        hoursTrained < 0
    ) {
        return NextResponse.json(
            {
                success: false,
                message:
                    "Missing or invalid id (ObjectId) or non-negative hoursTrained",
            },
            { status: 400 },
        );
    }

    try {
        await connectDB();

        const animal = await Animal.findByIdAndUpdate(
            id,
            { hoursTrained },
            { new: true, runValidators: true },
        ).lean();

        if (!animal) {
            return NextResponse.json(
                { success: false, message: "Animal does not exist" },
                { status: 400 },
            );
        }

        return NextResponse.json(
            {
                success: true,
                message: "Animal updated successfully",
                id: animal._id.toString(),
                name: animal.name,
                breed: animal.breed,
                owner: animal.owner.toString(),
                hoursTrained: animal.hoursTrained,
                profilePicture: animal.profilePicture,
            },
            { status: 200 },
        );
    } catch (e) {
        console.error(e);
        return NextResponse.json(
            { success: false, message: "Unable to update animal" },
            { status: 500 },
        );
    }
}
