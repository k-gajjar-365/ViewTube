import connectDB from "./db/index.js";
import dotenv from "dotenv";

// configuration for env files. this indicates -> "Load/Process all env variables (in ./.env) as soon as index.js file (i.e. this file) runs"
dotenv.config({
    path: "./.env"
})

connectDB()


















// Another approach to connect database using IIFE ( Immediately Invoked Function Expression ) (()=>{})()
/*
import mongoose from "mongoose";
import { DB_NAME } from "./constants.js";
import express from "express";

const app = express();

( async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)

        app.on("error", (error) => {
            console.log("Error: ",error);
            throw error
        })

        app.listen(process.env.PORT,() => {
            console.log(`App is listening on http://localhost:${process.env.PORT}`);
            
        })

    } catch (err) {
        console.log("Error: ",err);
        throw err
    }
})()
    */