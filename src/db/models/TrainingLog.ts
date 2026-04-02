import mongoose from "mongoose";
import { User } from "./User";

const TrainingLog = new mongoose.Schema({
    id: {
        type: mongoose.Types.ObjectId,
        required: true,
    },
    user: {
        type: User,
        required: true,
    },
    animal: {
        type: mongoose.Types.ObjectId,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    hours: {
        type: Number,
        required: true,
    },
});
