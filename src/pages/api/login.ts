import type { NextApiRequest, NextApiResponse } from "next/types";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    const { email, password } = req.body;
    await connectDB();

    const user = await db.users.findOne({ email });

    res.setHeader("Set-Cookie");
}
