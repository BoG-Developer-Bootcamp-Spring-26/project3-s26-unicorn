import { NextResponse } from "next/server";

import { connectDB } from "@/db/connectDB";
import { Animal } from "@/db/models/Animal";
import { TrainingLog } from "@/db/models/TrainingLog";
import { isValidObjectId } from "@/lib/objectId";

/** Adjust animal hours when a training log's animal and/or hours change. */
async function reconcileAnimalHoursAfterLogEdit(
    before: { animal: { toString(): string }; hours: number },
    after: { animal: { toString(): string }; hours: number },
) {
    const oldAnimal = before.animal.toString();
    const newAnimal = after.animal.toString();
    const oldHours = before.hours;
    const newHours = after.hours;

    if (oldAnimal === newAnimal && oldHours === newHours) {
        return;
    }

    if (oldAnimal === newAnimal) {
        await Animal.updateOne(
            { _id: oldAnimal },
            { $inc: { hoursTrained: newHours - oldHours } },
        );
    } else {
        await Animal.updateOne(
            { _id: oldAnimal },
            { $inc: { hoursTrained: -oldHours } },
        );
        await Animal.updateOne(
            { _id: newAnimal },
            { $inc: { hoursTrained: newHours } },
        );
    }
}

type CreateTrainingBody = {
    user?: unknown;
    animal?: unknown;
    title?: unknown;
    date?: unknown;
    description?: unknown;
    hours?: unknown;
};

type PatchTrainingBody = {
    id?: unknown;
    user?: unknown;
    title?: unknown;
    date?: unknown;
    description?: unknown;
    hours?: unknown;
    animal?: unknown;
};

export async function POST(request: Request) {
    let body: CreateTrainingBody;
    try {
        body = await request.json();
    } catch {
        return NextResponse.json(
            { success: false, message: "Invalid JSON body" },
            { status: 400 },
        );
    }

    const { user, animal, title, date, description, hours } = body;

    if (
        !isValidObjectId(user) ||
        !isValidObjectId(animal) ||
        typeof title !== "string" ||
        !title.trim() ||
        typeof description !== "string" ||
        !description.trim() ||
        typeof hours !== "number" ||
        Number.isNaN(hours) ||
        hours < 0
    ) {
        return NextResponse.json(
            {
                success: false,
                message:
                    "Missing or invalid user, animal, title, description, non-negative hours, or date",
            },
            { status: 400 },
        );
    }

    let parsedDate: Date;
    if (typeof date === "string" || typeof date === "number") {
        parsedDate = new Date(date);
    } else if (date instanceof Date) {
        parsedDate = date;
    } else {
        return NextResponse.json(
            { success: false, message: "date must be a string, number, or Date" },
            { status: 400 },
        );
    }

    if (Number.isNaN(parsedDate.getTime())) {
        return NextResponse.json(
            { success: false, message: "Invalid date" },
            { status: 400 },
        );
    }

    try {
        await connectDB();

        const animalDoc = await Animal.findById(animal).lean();
        if (!animalDoc) {
            return NextResponse.json(
                { success: false, message: "Animal does not exist" },
                { status: 400 },
            );
        }

        if (animalDoc.owner.toString() !== user) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "The specified animal is not owned by the specified user",
                },
                { status: 400 },
            );
        }

        const log = await TrainingLog.create({
            user,
            animal,
            title: title.trim(),
            date: parsedDate,
            description: description.trim(),
            hours,
        });

        const incResult = await Animal.updateOne(
            { _id: animal },
            { $inc: { hoursTrained: hours } },
        );
        if (incResult.matchedCount === 0) {
            await TrainingLog.findByIdAndDelete(log._id);
            return NextResponse.json(
                {
                    success: false,
                    message: "Unable to update animal hours after creating log",
                },
                { status: 500 },
            );
        }

        return NextResponse.json(
            {
                success: true,
                message: "Training log created successfully",
                id: log._id.toString(),
                user: log.user.toString(),
                animal: log.animal.toString(),
                title: log.title,
                date: log.date.toISOString(),
                description: log.description,
                hours: log.hours,
            },
            { status: 200 },
        );
    } catch (e) {
        console.error(e);
        return NextResponse.json(
            { success: false, message: "Unable to create training log" },
            { status: 500 },
        );
    }
}

export async function PATCH(request: Request) {
    let body: PatchTrainingBody;
    try {
        body = await request.json();
    } catch {
        return NextResponse.json(
            { success: false, message: "Invalid JSON body" },
            { status: 400 },
        );
    }

    const { id, user, title, date, description, hours, animal } = body;

    if (!isValidObjectId(id) || !isValidObjectId(user)) {
        return NextResponse.json(
            {
                success: false,
                message: "Missing or invalid id and user (ObjectIds)",
            },
            { status: 400 },
        );
    }

    try {
        await connectDB();

        const existing = await TrainingLog.findById(id).lean();
        if (!existing) {
            return NextResponse.json(
                { success: false, message: "Training log does not exist" },
                { status: 400 },
            );
        }

        if (existing.user.toString() !== user) {
            return NextResponse.json(
                { success: false, message: "User does not match this training log" },
                { status: 400 },
            );
        }

        const updates: Record<string, unknown> = {};

        if (title !== undefined) {
            if (typeof title !== "string" || !title.trim()) {
                return NextResponse.json(
                    { success: false, message: "title must be a non-empty string" },
                    { status: 400 },
                );
            }
            updates.title = title.trim();
        }

        if (description !== undefined) {
            if (typeof description !== "string" || !description.trim()) {
                return NextResponse.json(
                    {
                        success: false,
                        message: "description must be a non-empty string",
                    },
                    { status: 400 },
                );
            }
            updates.description = description.trim();
        }

        if (hours !== undefined) {
            if (typeof hours !== "number" || Number.isNaN(hours) || hours < 0) {
                return NextResponse.json(
                    { success: false, message: "hours must be a non-negative number" },
                    { status: 400 },
                );
            }
            updates.hours = hours;
        }

        if (date !== undefined) {
            let parsedDate: Date;
            if (typeof date === "string" || typeof date === "number") {
                parsedDate = new Date(date);
            } else if (date instanceof Date) {
                parsedDate = date;
            } else {
                return NextResponse.json(
                    { success: false, message: "date must be a string, number, or Date" },
                    { status: 400 },
                );
            }
            if (Number.isNaN(parsedDate.getTime())) {
                return NextResponse.json(
                    { success: false, message: "Invalid date" },
                    { status: 400 },
                );
            }
            updates.date = parsedDate;
        }

        if (animal !== undefined) {
            if (!isValidObjectId(animal)) {
                return NextResponse.json(
                    { success: false, message: "animal must be a valid ObjectId" },
                    { status: 400 },
                );
            }
            const animalDoc = await Animal.findById(animal).lean();
            if (!animalDoc) {
                return NextResponse.json(
                    { success: false, message: "Animal does not exist" },
                    { status: 400 },
                );
            }
            if (animalDoc.owner.toString() !== user) {
                return NextResponse.json(
                    {
                        success: false,
                        message:
                            "The specified animal is not owned by the user for this log",
                    },
                    { status: 400 },
                );
            }
            updates.animal = animal;
        }

        if (Object.keys(updates).length === 0) {
            return NextResponse.json(
                { success: false, message: "No valid fields to update" },
                { status: 400 },
            );
        }

        const updated = await TrainingLog.findByIdAndUpdate(id, updates, {
            new: true,
            runValidators: true,
        }).lean();

        if (!updated) {
            return NextResponse.json(
                { success: false, message: "Training log does not exist" },
                { status: 400 },
            );
        }

        await reconcileAnimalHoursAfterLogEdit(
            {
                animal: existing.animal,
                hours: existing.hours,
            },
            {
                animal: updated.animal,
                hours: updated.hours,
            },
        );

        return NextResponse.json(
            {
                success: true,
                message: "Training log updated successfully",
                id: updated._id.toString(),
                user: updated.user.toString(),
                animal: updated.animal.toString(),
                title: updated.title,
                date: new Date(updated.date).toISOString(),
                description: updated.description,
                hours: updated.hours,
            },
            { status: 200 },
        );
    } catch (e) {
        console.error(e);
        return NextResponse.json(
            { success: false, message: "Unable to update training log" },
            { status: 500 },
        );
    }
}
