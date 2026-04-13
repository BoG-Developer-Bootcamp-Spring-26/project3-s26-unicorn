import type { NextApiRequest, NextApiResponse } from "next";
import connectDB from "@/db/connectDB";
import { Animal } from "@/db/models/Animal";
import mongoose from "mongoose";

function isValidObjectId(id: unknown): boolean {
    return typeof id === "string" && mongoose.Types.ObjectId.isValid(id);
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    if (req.method === "POST") {
        const { name, breed, owner, hoursTrained, profilePicture } = req.body;

        if (
            typeof name !== "string" ||
            !name.trim() ||
            typeof breed !== "string" ||
            !breed.trim() ||
            !isValidObjectId(owner) ||
            typeof hoursTrained !== "number" ||
            hoursTrained < 0 ||
            typeof profilePicture !== "string" ||
            !profilePicture.trim()
        ) {
            return res
                .status(400)
                .json({ success: false, message: "Missing or invalid fields" });
        }

        try {
            await connectDB();
            const animal = await Animal.create({
                name,
                breed,
                owner,
                hoursTrained,
                profilePicture,
            });
            return res.status(200).json({
                success: true,
                message: "Animal created successfully",
                id: animal._id.toString(),
                name: animal.name,
                breed: animal.breed,
                owner: animal.owner.toString(),
                hoursTrained: animal.hoursTrained,
                profilePicture: animal.profilePicture,
            });
        } catch (e) {
            console.error(e);
            return res
                .status(500)
                .json({ success: false, message: "Unable to create animal" });
        }
    }

    if (req.method === "PATCH") {
        const { id, hoursTrained } = req.body;

        if (
            !isValidObjectId(id) ||
            typeof hoursTrained !== "number" ||
            hoursTrained < 0
        ) {
            return res
                .status(400)
                .json({ success: false, message: "Missing or invalid fields" });
        }

        try {
            await connectDB();
            const animal = await Animal.findByIdAndUpdate(
                id,
                { hoursTrained },
                { new: true, runValidators: true },
            ).lean();

            if (!animal)
                return res
                    .status(400)
                    .json({ success: false, message: "Animal does not exist" });

            return res.status(200).json({
                success: true,
                message: "Animal updated successfully",
                id: animal._id.toString(),
                name: animal.name,
                breed: animal.breed,
                owner: animal.owner.toString(),
                hoursTrained: animal.hoursTrained,
                profilePicture: animal.profilePicture,
            });
        } catch (e) {
            console.error(e);
            return res
                .status(500)
                .json({ success: false, message: "Unable to update animal" });
        }
    }

    return res
        .status(405)
        .json({ success: false, message: "Method not allowed" });
}
