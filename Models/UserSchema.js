import mongoose, { Schema } from "mongoose";

let UserSchema = new Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true }, 
    password: { type: String, required: true },
})


let User = mongoose.model("User",UserSchema)
export default User