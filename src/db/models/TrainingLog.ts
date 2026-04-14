import mongoose from "mongoose";

interface ITrainingLog {
    user: mongoose.Types.ObjectId;
    animal: mongoose.Types.ObjectId;
    title: string;
    date: Date;
    description: string;
    hours: number;
}

const TrainingLogSchema = new mongoose.Schema<ITrainingLog>({
    user: {
        type: mongoose.Types.ObjectId,
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

export const TrainingLog =
    mongoose.models.TrainingLog ||
    mongoose.model("TrainingLog", TrainingLogSchema);
