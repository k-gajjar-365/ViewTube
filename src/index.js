import connectDB from "./db/index.js";
import dotenv from "dotenv";
import app from "./app.js";

// configuration for env files. this indicates -> "Load/Process all env variables (in ./.env) as soon as index.js file (i.e. this file) runs"
dotenv.config({
    path: "./.env"
})

const port = process.env.PORT || 8000;
connectDB()
.then(() => {
    app.listen(port, () => {
        console.log(`Server is runing at : http://localhost:${port}`);
        
    })

    app.on("error", (err) => {
        console.log("Server error occurred : ",err);
        throw err
    })
})
.catch((err) => {
    console.log("MongoDB connection failed !!",err);
    
})


















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