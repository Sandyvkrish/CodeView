import mongoose from "mongoose";
import {ENV} from "./env.js";

export const connectDB = async() => {
try{
    const conn = await mongoose.connect(ENV.DB_URL)
    console.log("Connected to MongoDB",conn.connection.host)
} catch (error) {
    console.error("error connecting mongodb")
    process.exit(1);// tells node.js to stop immediately 1 error 0 success finished normally

}
}
