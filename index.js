import express from 'express'
import mongoose from 'mongoose'
import cookieParser from 'cookie-parser'
import cors from "cors";

import dotenv from 'dotenv'

import userRouter from './Routes/user.js'
import { v2 as cloudinary } from 'cloudinary'



let app = express()
dotenv.config()
cloudinary.config({ 
  cloud_name: process.env.CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});
app.use(express.json())
app.use(cookieParser())

app.get('/',(req,res)=>{
    res.send('hi')
})

app.use(cors({
    origin: "http://localhost:5173", 
    credentials: true, 
}));

app.use('/users', userRouter)

app.listen('3000',()=>{
    
    mongoose.connect(`${process.env.MONGO_URL}`).then(()=>{
        console.log("DB Connection was successful")
    }).catch((e)=>{
        console.log("error while connecting to database",e.message) 
    })
        console.log("Your app is running on 3000")
})
