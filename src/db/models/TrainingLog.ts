import mongoose from "mongoose";

const TrainingLog = new mongoose.Schema({
    id: {
        type: ObjectId,
        required: true,
    },
    user: {
        type: User,
        required: true,
    },
    animal: {
        type: ObjectId,
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
