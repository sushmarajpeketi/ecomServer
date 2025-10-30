import express from "express";
import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";

import userRouter from "./Routes/user.js";
import productRouter from './Routes/product.js'
let app = express();

app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use((req, res, next) => {
  console.log("req body is", JSON.stringify(req.body));

  console.log("📩 Incoming request:", req.method, req.url);
  next();
});

app.use((err, req, res, next) => {
  console.error("--- Global Error Handler ---");
  console.error(err);

});

app.use("/users", userRouter);
app.use("/products",productRouter)

app.listen("3000", () => {
  mongoose
    .connect(`${process.env.MONGO_URL}`)
    .then(() => {
      console.log("DB Connection was successful");
    })
    .catch((e) => {
      console.log("error while connecting to database", e.message);
    });
  console.log("Your app is running on 3000");
});
