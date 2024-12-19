import mongoose from "mongoose";
export const connectDB = async () => {
  try {
    
     
    const conn = await mongoose.connect(process.env.MONGO_URL);
    console.log(`Mongodb connected  sucessfully:${conn.connection.host}`);
  } catch (error) {
    console.error(`Error:${error.message}`);
    process.exit(1);
  }
};
