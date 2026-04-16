import type { NextApiRequest, NextApiResponse } from "next/types";
import connectDB from "@/db/connectDB";
import { TrainingLog } from "@/db/models/TrainingLog";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    if (req.method === "GET") {
        await connectDB();
    }
}
