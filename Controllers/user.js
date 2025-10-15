
import User from '../Models/UserSchema.js';
import jwt from 'jsonwebtoken'
import { z } from 'zod';


let signUp = async(req,res) => {
    const signupSchema = z.object({
        username: z.string().min(3, "Name must be at least 3 characters"),
        email: z.string().email("Invalid email address"),
        password: z.string().min(4, "Password must be at least 4 characters"),
    });
    const validation = signupSchema.safeParse(req.body);
    if (!validation.success) {
        console.log(validation)
        let errArr = validation.error.issues.map((e)=>{
            return {message:e.path[0]+": "+e.message}
        });
        return res.status(400).json({ error: errArr });
    }

    const { username, email, password } = validation.data;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(409).json({ error:  "Email already in use"    });
    }
    try {
        let user = await User.create({username,email,password})
        res.status(200).send({message:"user was created successfully.",user})
    } catch (error) {
        console.log("error while creating the user",error.message)
        return res.status(400).send({error:"error while creating the user"})
    }
    
}

let signIn = async(req,res) => {
    const signinSchema = z.object({
        email: z.string().email("Invalid email address"),
        password: z.string().min(4, "Password must be at least 4 characters"), // add strong password with atleast 1digit/special cha/alpha
    });
    const validation = signinSchema.safeParse(req.body);
    if (!validation.success) {
        console.log(validation)
        let errArr = validation.error.issues.map((e)=>{
            return {message:e.path[0]+": "+e.message}
        });
        return res.status(400).json({ error: errArr });
    }

    const { email, password } = validation.data;
    try {
        let user = await User.findOne({email,password})
        console.log("user",user)
        if(!user){
            console.log("user not found")
            return res.status(404).send({error:"user not found!"})
        }
        let username =user.username
        const token = jwt.sign({username,email},process.env.SECRETKEY,{expiresIn:"1hr"})
        res.cookie("token",token,{httpOnly:true,maxAge:60*60*1000})
        console.log("cookie was sent to user!")
        return res.status(200).send({message:"user logged in successfully!",user})
            
        } catch (error) {
            console.log("error while user login",error.message)
        }
}
const userInfo = async(req,res) =>{
    console.log("userInfo")
    try {
            res.status(200).send({
                username: req.user.username,
                email: req.user.email,
            });
        } catch (error) {
        res.status(500).send({ error: "Failed to fetch user info" });
    }
}

export {signUp,signIn,userInfo}