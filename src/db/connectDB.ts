import mongoose from "mongoose";

async function connect() {
    try {
        await mongoose.connect(process.env.DB_URL)
        console.log("Connected to MongoDB")
    } catch (e) {
        console.log("Unable to connect", e)
    }
}