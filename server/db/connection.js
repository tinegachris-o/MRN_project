import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path"
dotenv.config({ path: "./server/.env" });

export const connectDB = async () => {
  try {
    console.log('this is mongodb url' ,process.env.CLOUD_MONGO_URL);
//console.log("Loaded environment variables:", process.env);

    const conn = await mongoose.connect(process.env.CLOUD_MONGO_URL);
    console.log(`Mongodb connected  sucessfully:${conn.connection.host}`);
  } catch (error) {
    console.error(`Error:${error.message}`);
    process.exit(1);
  }
};
