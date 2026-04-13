import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

import { connectDB } from "@/db/connectDB";
import { TrainingLog } from "@/db/models/TrainingLog";

function parsePagination(searchParams: URLSearchParams) {
    const limitParam = parseInt(searchParams.get("limit") ?? "50", 10);
    const limit = Math.min(Math.max(limitParam, 1), 100);
    const cursor = searchParams.get("cursor");
    return { limit, cursor };
}

export async function GET(request: NextRequest) {
    try {
        await connectDB();

        const { limit, cursor } = parsePagination(request.nextUrl.searchParams);

        const filter: Record<string, unknown> = {};
        if (cursor) {
            if (!mongoose.Types.ObjectId.isValid(cursor)) {
                return NextResponse.json(
                    { success: true, training: [], nextCursor: null },
                    { status: 200 },
                );
            }
            filter._id = { $gt: new mongoose.Types.ObjectId(cursor) };
        }

        const docs = await TrainingLog.find(filter)
            .sort({ _id: 1 })
            .limit(limit + 1)
            .lean();

        const hasMore = docs.length > limit;
        const slice = hasMore ? docs.slice(0, limit) : docs;
        const nextCursor =
            hasMore && slice.length > 0
                ? String(slice[slice.length - 1]!._id)
                : null;

        const training = slice.map((t) => ({
            id: t._id.toString(),
            user: t.user.toString(),
            animal: t.animal.toString(),
            title: t.title,
            date: new Date(t.date).toISOString(),
            description: t.description,
            hours: t.hours,
        }));

        return NextResponse.json(
            { success: true, training, nextCursor },
            { status: 200 },
        );
    } catch (e) {
        console.error(e);
        return NextResponse.json(
            { success: false, message: "Unable to retrieve training logs" },
            { status: 500 },
        );
    }
}
