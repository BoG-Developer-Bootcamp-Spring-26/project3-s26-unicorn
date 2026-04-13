import mongoose from "mongoose";

let isConnected = false;

export default async function connectDB() {
    if (isConnected) {
        return;
    }

    const dbURL = process.env.DB_URL;

    if (!dbURL) {
        throw new Error("DB_URL is not defined in env");
    }

    try {
        await mongoose.connect(dbURL);
        isConnected = true;
        console.log("Connected to MongoDB");
    } catch (e) {
        console.error("Unable to connect", e);
        throw e;
    }
}
