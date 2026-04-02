import mongoose from "mongoose";

const animalSchema = new.mongoose.Schema({
    id: {
        type: ObjectId,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    breed: {
        type: String,
        required: true
    },
    owner: {
        type: ObjectId,
        required: true

    },
    hoursTrained: {
        type: Number,
        required: true
    },
    profilePicture: {
        type: String,
        required: true
    }
})
    Animal {
    _id: ObjectId // animal's ID
    name: string // animal's name
    breed: string // animal's breed
    owner: ObjectId // id of the animal's owner
    hoursTrained: number // total number of hours the animal has been trained for
    profilePicture: string // url to an image that can be displayed in an <img> tag
}
