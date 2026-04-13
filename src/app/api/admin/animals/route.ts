import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

import { connectDB } from "@/db/connectDB";
import { Animal } from "@/db/models/Animal";

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
                    { success: true, animals: [], nextCursor: null },
                    { status: 200 },
                );
            }
            filter._id = { $gt: new mongoose.Types.ObjectId(cursor) };
        }

        const docs = await Animal.find(filter)
            .sort({ _id: 1 })
            .limit(limit + 1)
            .lean();

        const hasMore = docs.length > limit;
        const slice = hasMore ? docs.slice(0, limit) : docs;
        const nextCursor =
            hasMore && slice.length > 0
                ? String(slice[slice.length - 1]!._id)
                : null;

        const animals = slice.map((a) => ({
            id: a._id.toString(),
            name: a.name,
            breed: a.breed,
            owner: a.owner.toString(),
            hoursTrained: a.hoursTrained,
            profilePicture: a.profilePicture,
        }));

        return NextResponse.json(
            { success: true, animals, nextCursor },
            { status: 200 },
        );
    } catch (e) {
        console.error(e);
        return NextResponse.json(
            { success: false, message: "Unable to retrieve animals" },
            { status: 500 },
        );
    }
}
