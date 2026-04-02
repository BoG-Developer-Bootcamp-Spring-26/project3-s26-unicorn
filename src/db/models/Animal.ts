import mongoose from "mongoose";

const AnimalSchema = new mongoose.Schema({
    id: {
        type: mongoose.Types.ObjectId,
        required: true,
    },
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
