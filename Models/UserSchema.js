import mongoose, { Schema } from "mongoose";

let UserSchema = new Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true }, 
    password: { type: String, required: true },
    mobile:{type:Number,required:true},
    role:{
        default:"user",
        enum:["admin","user"],
        type:String
    },
    img:{
      type: String
    }
})


let User = mongoose.model("User",UserSchema)
User.updateOne(
  { email: "sushmaraj808@gmail.com" }, 
  { $set: { role: "admin" } }
)
export default User