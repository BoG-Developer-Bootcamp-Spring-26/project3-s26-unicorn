import mongoose from "mongoose";

interface IAnimal {
    name: string;
    breed: string;
    owner: mongoose.Types.ObjectId;
    hoursTrained: number;
    profilePicture: string;
}

const AnimalSchema = new mongoose.Schema<IAnimal>({
    name: {
        type: String,
        required: true,
    },
    breed: {
        type: String,
        required: true,
    },
    owner: {
        type: mongoose.Types.ObjectId,
        required: true,
    },
    hoursTrained: {
        type: Number,
        required: true,
    },
    profilePicture: {
        type: String,
        required: true,
    },
});

export const Animal =
    mongoose.models.Animal || mongoose.model("Animal", AnimalSchema);
