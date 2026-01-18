import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
    try {
        const response = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log(`\nMongoDB Connected!! DB Host : ${response.connection.host}`);
        
    } catch (error) {
        console.error("MongoDB Connection error :",error);
        process.exit(1)
    }
}

export default connectDB