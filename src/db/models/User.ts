import mongoose from "mongoose";

const User = new mongoose.Schema({
    id: {
        type: mongoose.Types.ObjectId,
        required: true,
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    admin: {
        type: Boolean,
        required: true,
    },
});

export { User };
