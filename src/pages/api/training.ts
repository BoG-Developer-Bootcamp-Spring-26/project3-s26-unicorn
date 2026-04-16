import type { NextApiRequest, NextApiResponse } from "next";
import connectDB from "@/db/connectDB";
import { TrainingLog } from "@/db/models/TrainingLog";
import { Animal } from "@/db/models/Animal";
import mongoose from "mongoose";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    if (req.method === "POST") {
        const { userId, animalId, title, description, hours, date } = req.body;

        if (
            !mongoose.Types.ObjectId.isValid(userId) ||
            !mongoose.Types.ObjectId.isValid(animalId) ||
            typeof title !== "string" ||
            !title.trim() ||
            typeof description !== "string" ||
            !description.trim() ||
            typeof hours !== "number" ||
            hours < 0
        ) {
            return res
                .status(500)
                .json({ success: false, message: "Missing or invalid fields" });
        }

        try {
            await connectDB();
            const animal = await Animal.findById(animalId);
            if (!animal)
                return res
                    .status(500)
                    .json({ success: false, message: "Animal not found" });
            if (animal.owner.toString() !== userId) {
                return res.status(500).json({
                    success: false,
                    message: "Animal does not belong to this user",
                });
            }
            const log = await TrainingLog.create({
                user: userId,
                animal: animalId,
                title: title.trim(),
                date: new Date(date),
                description: description.trim(),
                hours,
            });
            await Animal.findByIdAndUpdate(animalId, {
                $inc: { hoursTrained: hours },
            });

            return res.status(200).json({
                success: true,
                message: "Training log created",
                id: log._id.toString(),
                title: log.title,
                date: log.date,
                hours: log.hours,
            });
        } catch (e) {
            console.error(e);
            return res
                .status(500)
                .json({ success: false, message: "Unable to create training log" });
        }
    }

    if (req.method === "GET") {
        const { userId } = req.query;

        if (!mongoose.Types.ObjectId.isValid(userId as string)) {
            return res
                .status(500)
                .json({ success: false, message: "Invalid userId" });
        }

        try {
            await connectDB();
            const logs = await TrainingLog.find({ user: userId })
                .sort({ date: -1 })
                .lean();
            return res.status(200).json({ success: true, logs });
        } catch (e) {
            console.error(e);
            return res
                .status(500)
                .json({ success: false, message: "Unable to fetch logs" });
        }
    }
    if (req.method === "PATCH") {
        const { id, title, description, hours } = req.body;
        const userId = req.cookies.userId;

        const log = await TrainingLog.findById(id);
        if (!log)
            return res.status(500).json({ success: false, message: "Log not found" });
        if (log.user.toString() !== userId)
            return res.status(500).json({ success: false, message: "Unauthorized" });

        await Animal.findByIdAndUpdate(log.animal, {
            $inc: { hoursTrained: hours - log.hours },
        });

        await TrainingLog.findByIdAndUpdate(id, { title, description, hours });
        return res.status(200).json({ success: true });
    }
    return res;
}
