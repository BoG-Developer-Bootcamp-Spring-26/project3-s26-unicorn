import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    id: {
        type: ObjectId,
        required: true
    },
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    admin: {
        type: Boolean,
        required: true
    }

})
User {
  _id: ObjectId // user's ID
  fullName: string // user's full name
  email: string // user's email
  password: string // user's password
  admin: boolean // holds whether or not a user is an admin
}
